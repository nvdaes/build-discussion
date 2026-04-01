/**
 * Test data for input-helper tests
 */

/**
 * Valid repository inputs
 */
export const validRepositories = {
  qualified: {
    input: 'test-owner/test-repo',
    expected: { owner: 'test-owner', name: 'test-repo' }
  },
  withHyphens: {
    input: 'my-org/my-awesome-repo',
    expected: { owner: 'my-org', name: 'my-awesome-repo' }
  },
  withNumbers: {
    input: 'org123/repo456',
    expected: { owner: 'org123', name: 'repo456' }
  }
}

/**
 * Invalid repository inputs
 */
export const invalidRepositories = {
  unqualified: {
    input: 'some-unqualified-repo',
    errorMessage:
      "Invalid repository 'some-unqualified-repo'. Expected format {owner}/{repo}."
  },
  tooManySlashes: {
    input: 'owner/repo/extra',
    errorMessage:
      "Invalid repository 'owner/repo/extra'. Expected format {owner}/{repo}."
  },
  emptyOwner: {
    input: '/some-repo',
    errorMessage:
      "Invalid repository '/some-repo'. Expected format {owner}/{repo}."
  },
  emptyName: {
    input: 'some-owner/',
    errorMessage:
      "Invalid repository 'some-owner/'. Expected format {owner}/{repo}."
  },
  multipleSlashes: {
    input: 'owner//repo',
    errorMessage:
      "Invalid repository 'owner//repo'. Expected format {owner}/{repo}."
  }
}

/**
 * Default fallback values (when no repository input is provided)
 */
export const defaultFallback = {
  owner: 'some-owner',
  name: 'some-repo'
}
