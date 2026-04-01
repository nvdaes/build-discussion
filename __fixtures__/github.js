/**
 * This file provides mock data and helpers for GitHub context in tests.
 */

/**
 * Default mock repository context
 */
export const mockRepoContext = {
  owner: 'some-owner',
  repo: 'some-repo'
}

/**
 * Creates a mock GitHub context object
 * @param {Object} overrides - Optional overrides for the context
 * @returns {Object} Mock GitHub context
 */
export function createMockContext(overrides = {}) {
  return {
    repo: {
      owner: overrides.owner || mockRepoContext.owner,
      repo: overrides.repo || mockRepoContext.repo
    },
    ...overrides
  }
}
