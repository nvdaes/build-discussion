/**
 * Function to get the ID of the specified repo and discussion category
 */
const core = require('@actions/core')
const github = require('@actions/github')
const { inputHelper } = require('./input-helper')

async function getRepositoryAndCategoryId() {
  const token = core.getInput('token')
  const octokit = github.getOctokit(token, {
    userAgent: 'getRepositoryAndCategoryIdVersion1'
  })
  const variables = inputHelper()
  const categoryPosition = parseInt(core.getInput('category-position'), 10)
  const query = `query($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name){
      id
      discussionCategories(first: categoryPosition){
        node {
          id
        }
      }
    }
  }`
  const result = await octokit.graphql(query, variables)
  return result
}

module.exports = {
  getRepositoryAndCategoryId
}
