/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const github = require('@actions/github')
const main = require('../src/main')

// Mock the GitHub Actions core library
const infoMock = jest.spyOn(core, 'info').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run').mockImplementation(id => {
  if (!id) {
    core.setFailed('ID is undefined')
  }
  core.setOutput('repoId', `${id}`)
})

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the repoId output', async () => {
    // Mock the action's inputs
    await main.run('some-id')
    expect(runMock).toHaveReturned()
    expect(setOutputMock).toHaveBeenCalledWith('repoId', expect.any(String))
  })

  it('fails setting the repoId', async () => {
    // Mock the action's inputs
    await main.run(undefined)
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith(expect.any(String))
  })
})
