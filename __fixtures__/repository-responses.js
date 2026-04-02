/**
 * Mock repository response fixtures for testing
 */

export const repositoryWithCategories = {
  repository: {
    id: 'repo-id-123',
    discussionCategories: {
      nodes: [{ id: 'cat-id-1' }, { id: 'cat-id-2' }]
    }
  }
}

export const repositoryWithManyCategories = {
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
}
