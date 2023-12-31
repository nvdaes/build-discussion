const core = require('@actions/core')
const github = require('@actions/github')
const {
  getRepositoryAndCategoryId
} = require('./get-repository-and-category-id')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  const resultWithRepoAndCatId = await getRepositoryAndCategoryId()
  const repoId = resultWithRepoAndCatId.repository.id
  const catIndex = parseInt(core.getInput('category-position'), 10) - 1
  const catId =
    resultWithRepoAndCatId.repository.discussionCategories.nodes[catIndex].id
  const body = core.getInput('body')
  const title = core.getInput('title')
  const token = core.getInput('token')
  const octokit = github.getOctokit(token, {
    userAgent: 'buildDiscussionVersion1'
  })
  const mutation = `mutation {
    createDiscussion(
      input: {
        body: "${body}",
        title: "${title}",
		      repositoryId: "${repoId}",
        categoryId: "${catId}",
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
  const response = await octokit.graphql(mutation)
  const discussionId = await response.createDiscussion.discussion.id
  const discussionUrl = await response.createDiscussion.discussion.url
  const discussionNumber = await response.createDiscussion.discussion.number
  core.setOutput('discussion-id', discussionId)
  core.setOutput('discussion-url', discussionUrl)
  core.setOutput('discussion-number', discussionNumber)
}

module.exports = {
  run
}
