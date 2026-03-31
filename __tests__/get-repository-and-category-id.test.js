/**
 * Unit tests for src/get-repository-and-category-id.js
 */
import { jest } from '@jest/globals'

// Mock the module before any dynamic imports
jest.unstable_mockModule('../src/get-repository-and-category-id.js', () => ({
  getRepositoryAndCategoryId: jest.fn()
}))

const github = await import('@actions/github')
const getRepositoryAndCategoryId =
  await import('../src/get-repository-and-category-id.js')

describe('getRepositoryAndCategoryId tests', () => {
  beforeAll(() => {
    // Mock getRepositoryAndCategoryId
    getRepositoryAndCategoryId.getRepositoryAndCategoryId.mockImplementation(
      () => {
        const gh = github.getOctokit('_')
        jest.spyOn(gh, 'graphql')
        return { repoId: 'some-repo-id', catId: 'some-cat-id' }
      }
    )
  })

  afterAll(() => {
    // Restore.mockImplementation(jest.fn())
    jest.restoreAllMocks()
  })

  it('gets repo and cat id', async () => {
    const result = await getRepositoryAndCategoryId.getRepositoryAndCategoryId()
    expect(result.repoId).toBe('some-repo-id')
    expect(result.catId).toBe('some-cat-id')
  })
})
