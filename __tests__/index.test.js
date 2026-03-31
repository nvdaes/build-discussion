/**
 * Unit tests for the action's entrypoint, src/index.js
 */
import { jest } from '@jest/globals'

// Mock the action's main module before any dynamic imports
jest.unstable_mockModule('../src/main.js', () => ({
  run: jest.fn()
}))

const { run } = await import('../src/main.js')

describe('index', () => {
  it('calls run when imported', async () => {
    await import('../src/index.js')

    expect(run).toHaveBeenCalled()
  })
})
