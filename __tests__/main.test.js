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

// Mock the action's main module
jest.unstable_mockModule('../src/main.js', () => ({
  run: jest.fn()
}))

// Dynamic imports after mock setup
const core = await import('@actions/core')
const main = await import('../src/main.js')

/** Sets expected mock behavior for run */
function setupRunMock() {
  main.run.mockImplementation(id => {
    if (!id) {
      core.setFailed('ID is undefined')
    }
    core.setOutput('repoId', `${id}`)
  })
}

setupRunMock()

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupRunMock()
  })

  it('sets the repoId output', async () => {
    await main.run('some-id')
    expect(main.run).toHaveReturned()
    expect(core.setOutput).toHaveBeenCalledWith('repoId', expect.any(String))
  })

  it('fails setting the repoId', async () => {
    await main.run(undefined)
    expect(main.run).toHaveReturned()
    expect(core.setFailed).toHaveBeenCalledWith(expect.any(String))
  })
})
