import * as core from '@actions/core'
import * as github from '@actions/github'
import { getRepositoryAndCategoryId } from './get-repository-and-category-id.js'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  const resultWithRepoAndCatId = await getRepositoryAndCategoryId()
  const repoId = resultWithRepoAndCatId.repository.id
  const catIndex = parseInt(core.getInput('category-position'), 10) - 1

  // Validate array bounds
  const categories =
    resultWithRepoAndCatId.repository.discussionCategories.nodes
  if (catIndex < 0 || catIndex >= categories.length) {
    throw new Error(
      `Category position ${catIndex + 1} is out of bounds. Available categories: ${categories.length}`
    )
  }

  const catId = categories[catIndex].id
  const body = core.getInput('body')
  const title = core.getInput('title')
  const token = core.getInput('token')
  const octokit = github.getOctokit(token, {
    userAgent: 'buildDiscussionVersion1'
  })
  const mutation = `mutation($body: String!, $title: String!, $repoId: ID!, $catId: ID!) {
    createDiscussion(
      input: {
        body: $body,
        title: $title,
        repositoryId: $repoId,
        categoryId: $catId,
        clientMutationId: "build-discussion version 1"
      }
    ) {
      clientMutationId
      discussion {
        id
        url
        number
      }
    }
    }`
  const response = await octokit.graphql(mutation, {
    body,
    title,
    repoId,
    catId
  })
  const discussionId = response.createDiscussion.discussion.id
  const discussionUrl = response.createDiscussion.discussion.url
  const discussionNumber = response.createDiscussion.discussion.number
  core.setOutput('discussion-id', discussionId)
  core.setOutput('discussion-url', discussionUrl)
  core.setOutput('discussion-number', discussionNumber)
}

export { run }
