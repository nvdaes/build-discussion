/**
 * Unit tests for the action's main functionality, src/main.js
 */
import { jest } from '@jest/globals'
import {
  validInputs,
  minimalInputs,
  createGetInputMock
} from '../__fixtures__/action-inputs.js'
import {
  repositoryWithCategories,
  repositoryWithManyCategories
} from '../__fixtures__/repository-responses.js'
import {
  createDiscussionSuccess,
  createDiscussionMinimal
} from '../__fixtures__/discussion-responses.js'

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
    core.getInput.mockImplementation(createGetInputMock(validInputs))
    getRepositoryAndCategoryId.mockResolvedValue(repositoryWithCategories)

    const mockGraphql = jest.fn().mockResolvedValue(createDiscussionSuccess)
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
    expect(github.getOctokit).toHaveBeenCalledWith(validInputs.token, {
      userAgent: 'buildDiscussionVersion1'
    })
    expect(mockGraphql).toHaveBeenCalledWith(
      expect.stringContaining('createDiscussion'),
      {
        body: validInputs.body,
        title: validInputs.title,
        repoId: repositoryWithCategories.repository.id,
        catId:
          repositoryWithCategories.repository.discussionCategories.nodes[1].id
      }
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'discussion-id',
      createDiscussionSuccess.createDiscussion.discussion.id
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'discussion-url',
      createDiscussionSuccess.createDiscussion.discussion.url
    )
    expect(core.setOutput).toHaveBeenCalledWith(
      'discussion-number',
      createDiscussionSuccess.createDiscussion.discussion.number
    )
  })

  it('uses correct category index', async () => {
    // Setup mocks for testing the category indexing
    core.getInput.mockImplementation(createGetInputMock(minimalInputs))
    getRepositoryAndCategoryId.mockResolvedValue(repositoryWithManyCategories)

    const mockGraphql = jest.fn().mockResolvedValue(createDiscussionMinimal)
    github.getOctokit.mockReturnValue({
      graphql: mockGraphql
    })

    // Execute
    await run()

    // Verify it uses the first category (index 0)
    expect(mockGraphql).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        catId:
          repositoryWithManyCategories.repository.discussionCategories.nodes[0]
            .id
      })
    )
  })

  it('throws error when category position is out of bounds (too high)', async () => {
    // Setup mocks with category-position 5 but only 2 categories available
    const highPositionInputs = { ...validInputs, 'category-position': '5' }
    core.getInput.mockImplementation(createGetInputMock(highPositionInputs))
    getRepositoryAndCategoryId.mockResolvedValue(repositoryWithCategories)

    const mockGraphql = jest.fn()
    github.getOctokit.mockReturnValue({
      graphql: mockGraphql
    })

    // Execute and expect error
    await expect(run()).rejects.toThrow(
      'Category position 5 is out of bounds. Available categories: 2'
    )
  })

  it('throws error when category position is out of bounds (negative)', async () => {
    // Setup mocks with category-position 0 (becomes -1 after subtracting 1)
    const zeroPositionInputs = { ...validInputs, 'category-position': '0' }
    core.getInput.mockImplementation(createGetInputMock(zeroPositionInputs))
    getRepositoryAndCategoryId.mockResolvedValue(repositoryWithCategories)

    const mockGraphql = jest.fn()
    github.getOctokit.mockReturnValue({
      graphql: mockGraphql
    })

    // Execute and expect error
    await expect(run()).rejects.toThrow(
      'Category position 0 is out of bounds. Available categories: 2'
    )
  })
})
