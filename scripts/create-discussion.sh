#!/usr/bin/env bash
set -e

# Validate required environment variables
if [ -z "$REPOSITORY" ]; then
  echo "::error::REPOSITORY environment variable is required"
  exit 1
fi

if [ -z "$TITLE" ]; then
  echo "::error::TITLE environment variable is required"
  exit 1
fi

if [ -z "$BODY" ]; then
  echo "::error::BODY environment variable is required"
  exit 1
fi

if [ -z "$CATEGORY_POSITION" ]; then
  echo "::error::CATEGORY_POSITION environment variable is required"
  exit 1
fi

if [ -z "$GITHUB_OUTPUT" ]; then
  echo "::error::GITHUB_OUTPUT environment variable is required"
  exit 1
fi

# Validate category position
if ! [[ "$CATEGORY_POSITION" =~ ^[0-9]+$ ]] || [ "$CATEGORY_POSITION" -lt 1 ]; then
  echo "::error::Invalid category-position '$CATEGORY_POSITION'. Must be a positive integer."
  exit 1
fi

# Parse repository owner and name
IFS='/' read -r OWNER NAME <<< "$REPOSITORY"
if [ -z "$OWNER" ] || [ -z "$NAME" ]; then
  echo "::error::Invalid repository format '$REPOSITORY'. Expected format: owner/name"
  exit 1
fi

# Validate that NAME doesn't contain additional slashes
if [[ "$NAME" == */* ]]; then
  echo "::error::Invalid repository format '$REPOSITORY'. Expected format: owner/name (found multiple slashes)"
  exit 1
fi

echo "::debug::Repository: ${OWNER}/${NAME}"
echo "::debug::Category position: ${CATEGORY_POSITION}"

# Calculate category index (position is 1-based, array is 0-based)
CATEGORY_INDEX=$((CATEGORY_POSITION - 1))

# Query to get repository ID and discussion categories
REPO_QUERY='
query($owner: String!, $name: String!, $first: Int!) {
  repository(owner: $owner, name: $name) {
    id
    discussionCategories(first: $first) {
      nodes {
        id
        name
      }
    }
  }
}'

echo "::group::Fetching repository and categories"
repo_data=$(gh api graphql \
  -f query="$REPO_QUERY" \
  -F owner="$OWNER" \
  -F name="$NAME" \
  -F first="$CATEGORY_POSITION") || {
  echo "::error::Failed to fetch repository data"
  exit 1
}

# Check for GraphQL errors
if echo "$repo_data" | jq -e '.errors' > /dev/null 2>&1; then
  error_msg=$(echo "$repo_data" | jq -r '.errors[0].message')
  echo "::error::GraphQL error: $error_msg"
  exit 1
fi
echo "::endgroup::"

# Extract repository ID
repo_id=$(echo "$repo_data" | jq -r '.data.repository.id')
if [ -z "$repo_id" ] || [ "$repo_id" = "null" ]; then
  echo "::error::Repository not found or inaccessible: $REPOSITORY"
  exit 1
fi

# Get total number of categories
categories_count=$(echo "$repo_data" | jq '.data.repository.discussionCategories.nodes | length')
if [ -z "$categories_count" ] || ! [[ "$categories_count" =~ ^[0-9]+$ ]]; then
  echo "::error::Failed to parse discussion categories"
  exit 1
fi

if [ "$categories_count" -eq 0 ]; then
  echo "::error::Repository has no discussion categories enabled"
  exit 1
fi

# Validate category index
if [ "$CATEGORY_INDEX" -ge "$categories_count" ]; then
  echo "::error::Category position $CATEGORY_POSITION is out of bounds. Available categories: $categories_count"
  exit 1
fi

# Extract category ID
cat_id=$(echo "$repo_data" | jq -r --argjson idx "$CATEGORY_INDEX" '.data.repository.discussionCategories.nodes[$idx].id') || {
  echo "::error::Failed to extract category data"
  exit 1
}
cat_name=$(echo "$repo_data" | jq -r --argjson idx "$CATEGORY_INDEX" '.data.repository.discussionCategories.nodes[$idx].name')

if [ -z "$cat_id" ] || [ "$cat_id" = "null" ]; then
  echo "::error::Failed to get category ID at position $CATEGORY_POSITION"
  exit 1
fi

echo "::debug::Using category: ${cat_name} (ID: ${cat_id})"

# Mutation to create discussion
CREATE_MUTATION='
mutation($body: String!, $title: String!, $repoId: ID!, $catId: ID!) {
  createDiscussion(
    input: {
      body: $body
      title: $title
      repositoryId: $repoId
      categoryId: $catId
      clientMutationId: "build-discussion-cli-v1"
    }
  ) {
    clientMutationId
    discussion {
      id
      url
      number
    }
  }
}'

echo "::group::Creating discussion"
discussion_data=$(gh api graphql \
  -f query="$CREATE_MUTATION" \
  -F body="$BODY" \
  -F title="$TITLE" \
  -F repoId="$repo_id" \
  -F catId="$cat_id") || {
  echo "::error::Failed to create discussion"
  exit 1
}

# Check for GraphQL errors
if echo "$discussion_data" | jq -e '.errors' > /dev/null 2>&1; then
  error_msg=$(echo "$discussion_data" | jq -r '.errors[0].message')
  echo "::error::GraphQL error: $error_msg"
  exit 1
fi
echo "::endgroup::"

# Extract discussion details
discussion_id=$(echo "$discussion_data" | jq -r '.data.createDiscussion.discussion.id') || {
  echo "::error::Failed to parse discussion response"
  exit 1
}
discussion_url=$(echo "$discussion_data" | jq -r '.data.createDiscussion.discussion.url')
discussion_number=$(echo "$discussion_data" | jq -r '.data.createDiscussion.discussion.number')

if [ -z "$discussion_id" ] || [ "$discussion_id" = "null" ]; then
  echo "::error::Failed to extract discussion ID from response"
  exit 1
fi

if [ -z "$discussion_url" ] || [ "$discussion_url" = "null" ]; then
  echo "::warning::Failed to extract discussion URL from response"
fi

if [ -z "$discussion_number" ] || [ "$discussion_number" = "null" ]; then
  echo "::warning::Failed to extract discussion number from response"
fi

# Set outputs (sanitize values to prevent newline injection)
discussion_id_clean="${discussion_id//$'\n'/}"
discussion_url_clean="${discussion_url//$'\n'/}"
discussion_number_clean="${discussion_number//$'\n'/}"

echo "discussion-id=$discussion_id_clean" >> "$GITHUB_OUTPUT"
echo "discussion-url=$discussion_url_clean" >> "$GITHUB_OUTPUT"
echo "discussion-number=$discussion_number_clean" >> "$GITHUB_OUTPUT"

echo "::notice::Discussion created successfully: ${discussion_url_clean}"
echo "Discussion #${discussion_number_clean} created: ${discussion_url_clean}"
