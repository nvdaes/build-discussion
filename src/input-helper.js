/**
 * Function to get input
 */
import * as core from '@actions/core'
import * as github from '@actions/github'

function inputHelper() {
  // Qualified repository
  const qualifiedRepository =
    core.getInput('repository') ||
    `${github.context.repo.owner}/${github.context.repo.repo}`
  core.debug(`qualified repository = '${qualifiedRepository}'`)
  const splitRepository = qualifiedRepository.split('/')
  if (
    splitRepository.length !== 2 ||
    !splitRepository[0] ||
    !splitRepository[1]
  ) {
    core.setFailed(
      `Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`
    )
  }
  const variables = {
    owner: splitRepository[0],
    name: splitRepository[1]
  }
  return variables
}

export { inputHelper }
