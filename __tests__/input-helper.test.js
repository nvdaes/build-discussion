/**
 * Unit tests for src/input-helper.js
 */
const core = require('@actions/core')
const github = require('@actions/github')
const { inputHelper } = require('../src/input-helper')

// Inputs for mock @actions/core
let inputs = {}

describe('input-helper tests', () => {
  beforeAll(() => {
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      return inputs[name]
    })

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
    // Mock github context
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => {
      return {
        owner: 'some-owner',
        repo: 'some-repo'
      }
    })
  })

  beforeEach(() => {
    // Reset inputs
    inputs = {}
  })

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  it('sets defaults', async () => {
    const settings = await inputHelper()
    expect(settings).toBeTruthy()
    expect(settings.owner).toBe('some-owner')
    expect(settings.name).toBe('some-repo')
  })

  it('requires qualified repo', async () => {
    inputs.repository = 'some-unqualified-repo'
    // Mock setFailed
    const setFailedMock = jest
      .spyOn(core, 'setFailed')
      .mockImplementation(jest.fn())
    await inputHelper()
    expect(setFailedMock).toHaveBeenCalled()
    expect.assertions(1)
  })
})
