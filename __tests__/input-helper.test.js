/**
 * Unit tests for src/input-helper.js
 */
import { jest } from '@jest/globals'

let inputs = {}

// Mock @actions/core before any dynamic imports
jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(name => inputs[name]),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  setFailed: jest.fn()
}))

// Dynamic imports after mock setup
const core = await import('@actions/core')
const github = await import('@actions/github')
const { inputHelper } = await import('../src/input-helper.js')

describe('input-helper tests', () => {
  beforeAll(() => {
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
    await inputHelper()
    expect(core.setFailed).toHaveBeenCalled()
    expect.assertions(1)
  })
})
