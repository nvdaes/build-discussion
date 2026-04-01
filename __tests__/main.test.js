/**
 * Unit tests for the action's main functionality, src/main.js
 */
import { jest } from '@jest/globals'

// Mock @actions/core before any dynamic imports
jest.unstable_mockModule('@actions/core', () => ({
  info: jest.fn(),
  getInput: jest.fn(),
  setFailed: jest.fn(),
  setOutput: jest.fn(),
  debug: jest.fn()
}))

// Mock @actions/github
jest.unstable_mockModule('@actions/github', () => ({
  getOctokit: jest.fn()
}))

// Mock get-repository-and-category-id
jest.unstable_mockModule('../src/get-repository-and-category-id.js', () => ({
  getRepositoryAndCategoryId: jest.fn()
}))

// Dynamic imports after mock setup
const core = await import('@actions/core')
const github = await import('@actions/github')
const { getRepositoryAndCategoryId } =
  await import('../src/get-repository-and-category-id.js')
const { run } = await import('../src/main.js')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the discussion outputs successfully', async () => {
    // Setup mocks
    core.getInput.mockImplementation(input => {
      if (input === 'category-position') return '2'
      if (input === 'body') return 'Test discussion body'
      if (input === 'title') return 'Test Discussion Title'
      if (input === 'token') return 'test-token'
      return ''
    })

    getRepositoryAndCategoryId.mockResolvedValue({
      repository: {
        id: 'repo-id-123',
        discussionCategories: {
          nodes: [{ id: 'cat-id-1' }, { id: 'cat-id-2' }]
        }
      }
    })

    const mockGraphql = jest.fn().mockResolvedValue({
      createDiscussion: {
        clientMutationId: 'build-discussion version 1',
        discussion: {
          id: 'discussion-id-456',
          url: 'https://github.com/test/repo/discussions/1',
          number: 1
        }
      }
    })

    github.getOctokit.mockReturnValue({
      graphql: mockGraphql
    })

    // Execute
    await run()

    // Verify
    expect(getRepositoryAndCategoryId).toHaveBeenCalled()
    expect(core.getInput).toHaveBeenCalledWith('category-position')
    expect(core.getInput).toHaveBeenCalledWith('body')
    expect(core.getInput).toHaveBeenCalledWith('title')
    expect(core.getInput).toHaveBeenCalledWith('token')
    expect(github.getOctokit).toHaveBeenCalledWith('test-token', {
      userAgent: 'buildDiscussionVersion1'
    })
    expect(mockGraphql).toHaveBeenCalledWith(
      expect.stringContaining('createDiscussion'),
      {
        body: 'Test discussion body',
        title: 'Test Discussion Title',
        repoId: 'repo-id-123',
        catId: 'cat-id-2'
      }
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'discussion-id',
      'discussion-id-456'
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'discussion-url',
      'https://github.com/test/repo/discussions/1'
    )
    expect(core.setOutput).toHaveBeenCalledWith('discussion-number', 1)
  })

  it('uses correct category index', async () => {
    // Setup mocks for testing the category indexing
    core.getInput.mockImplementation(input => {
      if (input === 'category-position') return '1'
      if (input === 'body') return 'Body'
      if (input === 'title') return 'Title'
      if (input === 'token') return 'token'
      return ''
    })

    getRepositoryAndCategoryId.mockResolvedValue({
      repository: {
        id: 'repo-id',
        discussionCategories: {
          nodes: [
            { id: 'first-cat-id' },
            { id: 'second-cat-id' },
            { id: 'third-cat-id' }
          ]
        }
      }
    })

    const mockGraphql = jest.fn().mockResolvedValue({
      createDiscussion: {
        discussion: {
          id: 'disc-id',
          url: 'url',
          number: 1
        }
      }
    })

    github.getOctokit.mockReturnValue({
      graphql: mockGraphql
    })

    // Execute
    await run()

    // Verify it uses the first category (index 0)
    expect(mockGraphql).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        catId: 'first-cat-id'
      })
    )
  })
})
