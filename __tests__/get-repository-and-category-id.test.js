/**
 * Unit tests for src/get-repository-and-category-id.js
 */
import { jest } from '@jest/globals'
import { repositoryWithCategories } from '../__fixtures__/repository-responses.js'

// Mock @actions/core
jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn()
}))

// Mock @actions/github
jest.unstable_mockModule('@actions/github', () => ({
  getOctokit: jest.fn()
}))

// Mock input-helper
jest.unstable_mockModule('../src/input-helper.js', () => ({
  inputHelper: jest.fn()
}))

const core = await import('@actions/core')
const github = await import('@actions/github')
const { inputHelper } = await import('../src/input-helper.js')
const { getRepositoryAndCategoryId } =
  await import('../src/get-repository-and-category-id.js')

describe('getRepositoryAndCategoryId tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('gets repo and cat id', async () => {
    // Setup mocks
    core.getInput.mockImplementation(input => {
      if (input === 'token') return 'test-token'
      if (input === 'category-position') return '2'
      return ''
    })

    inputHelper.mockReturnValue({
      owner: 'test-owner',
      name: 'test-repo'
    })

    const mockGraphql = jest.fn().mockResolvedValue(repositoryWithCategories)

    github.getOctokit.mockReturnValue({
      graphql: mockGraphql
    })

    // Execute
    const result = await getRepositoryAndCategoryId()

    // Verify
    expect(github.getOctokit).toHaveBeenCalledWith('test-token', {
      userAgent: 'getRepositoryAndCategoryIdVersion1'
    })
    expect(inputHelper).toHaveBeenCalled()
    expect(core.getInput).toHaveBeenCalledWith('token')
    expect(core.getInput).toHaveBeenCalledWith('category-position')
    expect(mockGraphql).toHaveBeenCalledWith(
      expect.stringContaining('query($owner:String!, $name:String!)'),
      { owner: 'test-owner', name: 'test-repo' }
    )
    expect(result.repository.id).toBe('repo-id-123')
    expect(result.repository.discussionCategories.nodes).toHaveLength(2)
  })
})
