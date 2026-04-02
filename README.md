# Build discussion action

This action creates a GitHub discussion using the GitHub CLI.

It's inspired by the
[Create GitHub discussion action](https://github.com/marketplace/actions/create-github-discussion),
by @abirismyname.

## Implementation

This is a **composite action** that uses the GitHub CLI (`gh`) to interact with
the GitHub GraphQL API. It requires no bundling or JavaScript dependencies,
making it simple to maintain and contribute to.

## Version History

### Version 2 (Current)

- **Implementation**: Composite action using GitHub CLI
- **Runtime**: Shell script (Bash)
- **Dependencies**: None (uses pre-installed `gh` CLI)
- **Compatibility**: Drop-in replacement for v1 - all inputs and outputs remain
  identical

### Version 1 (Legacy)

- **Implementation**: JavaScript action using Node.js
- **Runtime**: Node.js 20
- **Dependencies**: Bundled JavaScript packages

**Migration Note**: Version 2 is fully backward compatible with version 1. No
workflow changes are required. The GitHub CLI (`gh`) is pre-installed on all
GitHub-hosted runners.

## Inputs

### `repository`

The repository where the discussion should be created. Default
`${{ github.repository }}`.

### `token`

GitHub token. Default `${{ github.token }}`.

### `category-position`

The position of the category for the discussion, starting with 1 for the first
available category. Default `1`.

### `title`

Discussion title. Default `Discussion created with Build discussion action`.

### `body`

Discussion body. Default `This is the discussion body`.

## Outputs

### `discussion-id`

Discussion ID.

### `discussion-url`

Discussion URL.

### `discussion-number`

Discussion number.

## Example usage

```yaml
- name: Build discussion
  id: build-discussion
  uses: nvdaes/build-discussion@v2
  with:
    repository: owner/repo
    category-position: 1
    title: My GitHub discussion
    body: |
      My body.
      Can be multiline.

- name: Print Output
  id: output
  run: |
    echo "${{ steps.build-discussion.outputs.discussion-id }}"
    echo "${{ steps.build-discussion.outputs.discussion-url }}"
    echo "${{ steps.build-discussion.outputs.discussion-number }}"
```
