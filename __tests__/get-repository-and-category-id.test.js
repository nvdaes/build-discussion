/**
 * Unit tests for src/get-repository-and-category-id.js
 */
const github = require('@actions/github')
const getRepositoryAndCategoryId = require('../src/get-repository-and-category-id')

describe('getRepositoryAndCategoryId tests', () => {
  beforeAll(() => {
    // Mock getRepositoryAndCategoryId
    jest
      .spyOn(getRepositoryAndCategoryId, 'getRepositoryAndCategoryId')
      .mockImplementation(() => {
        const gh = github.getOctokit('_')
        jest.spyOn(gh, 'graphql')
        return { repoId: 'some-repo-id', catId: 'some-cat-id' }
      })
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
