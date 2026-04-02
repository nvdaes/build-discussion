/**
 * Mock GraphQL response fixtures for testing
 */

export const createDiscussionSuccess = {
  createDiscussion: {
    clientMutationId: 'build-discussion version 1',
    discussion: {
      id: 'discussion-id-456',
      url: 'https://github.com/test/repo/discussions/1',
      number: 1
    }
  }
}

export const createDiscussionMinimal = {
  createDiscussion: {
    discussion: {
      id: 'disc-id',
      url: 'url',
      number: 1
    }
  }
}
