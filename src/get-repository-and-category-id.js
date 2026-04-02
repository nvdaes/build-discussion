/**
 * Function to get the ID of the specified repo and discussion category
 */
import * as core from '@actions/core'
import * as github from '@actions/github'
import { inputHelper } from './input-helper.js'

async function getRepositoryAndCategoryId() {
  const token = core.getInput('token')
  const octokit = github.getOctokit(token, {
    userAgent: 'getRepositoryAndCategoryIdVersion1'
  })
  const variables = inputHelper()
  const categoryPosition = parseInt(core.getInput('category-position'), 10)

  // Validate category position
  if (isNaN(categoryPosition) || categoryPosition < 1) {
    throw new Error(
      `Invalid category-position '${core.getInput('category-position')}'. Must be a positive integer.`
    )
  }

  const query = `query($owner:String!, $name:String!, $first:Int!) {
    repository(owner:$owner, name:$name){
      id
      discussionCategories(first: $first){
        nodes {
          id
        }
      }
    }
  }`
  const result = await octokit.graphql(query, {
    ...variables,
    first: categoryPosition
  })
  return result
}

export { getRepositoryAndCategoryId }
