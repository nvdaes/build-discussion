/**
 * Unit tests for src/input-helper.js
 */
import { jest } from '@jest/globals'
import {
  validRepositories,
  invalidRepositories,
  defaultFallback
} from '../__fixtures__/input-helper-data.js'
import { mockRepoContext } from '../__fixtures__/github.js'

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
    jest.spyOn(github.context, 'repo', 'get').mockImplementation(() => ({
      owner: mockRepoContext.owner,
      repo: mockRepoContext.repo
    }))
  })

  beforeEach(() => {
    // Reset inputs
    inputs = {}
    // Clear all mocks
    jest.clearAllMocks()
  })

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  it('sets defaults when no repository input provided', () => {
    const settings = inputHelper()
    expect(settings).toBeTruthy()
    expect(settings.owner).toBe(defaultFallback.owner)
    expect(settings.name).toBe(defaultFallback.name)
    expect(core.debug).toHaveBeenCalledWith(
      `qualified repository = '${defaultFallback.owner}/${defaultFallback.name}'`
    )
  })

  it('uses provided qualified repository', () => {
    const testCase = validRepositories.qualified
    inputs.repository = testCase.input
    const settings = inputHelper()
    expect(settings.owner).toBe(testCase.expected.owner)
    expect(settings.name).toBe(testCase.expected.name)
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('handles repository with hyphens', () => {
    const testCase = validRepositories.withHyphens
    inputs.repository = testCase.input
    const settings = inputHelper()
    expect(settings.owner).toBe(testCase.expected.owner)
    expect(settings.name).toBe(testCase.expected.name)
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('handles repository with numbers', () => {
    const testCase = validRepositories.withNumbers
    inputs.repository = testCase.input
    const settings = inputHelper()
    expect(settings.owner).toBe(testCase.expected.owner)
    expect(settings.name).toBe(testCase.expected.name)
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('logs debug information with qualified repository', () => {
    const testCase = validRepositories.qualified
    inputs.repository = testCase.input
    inputHelper()
    expect(core.debug).toHaveBeenCalledWith(
      `qualified repository = '${testCase.input}'`
    )
  })

  it('fails on unqualified repository (no slash)', () => {
    const testCase = invalidRepositories.unqualified
    inputs.repository = testCase.input
    const settings = inputHelper()
    expect(core.setFailed).toHaveBeenCalledWith(testCase.errorMessage)
    // Function still returns values even after setFailed
    expect(settings.owner).toBe(testCase.input)
    expect(settings.name).toBeUndefined()
  })

  it('fails on repository with too many slashes', () => {
    const testCase = invalidRepositories.tooManySlashes
    inputs.repository = testCase.input
    inputHelper()
    expect(core.setFailed).toHaveBeenCalledWith(testCase.errorMessage)
  })

  it('fails on repository with empty owner', () => {
    const testCase = invalidRepositories.emptyOwner
    inputs.repository = testCase.input
    inputHelper()
    expect(core.setFailed).toHaveBeenCalledWith(testCase.errorMessage)
  })

  it('fails on repository with empty name', () => {
    const testCase = invalidRepositories.emptyName
    inputs.repository = testCase.input
    inputHelper()
    expect(core.setFailed).toHaveBeenCalledWith(testCase.errorMessage)
  })

  it('fails on repository with multiple consecutive slashes', () => {
    const testCase = invalidRepositories.multipleSlashes
    inputs.repository = testCase.input
    inputHelper()
    expect(core.setFailed).toHaveBeenCalledWith(testCase.errorMessage)
  })

  it('falls back to defaults when repository input is empty string', () => {
    inputs.repository = ''
    const settings = inputHelper()
    expect(settings.owner).toBe(defaultFallback.owner)
    expect(settings.name).toBe(defaultFallback.name)
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('returns object with owner and name properties', () => {
    const settings = inputHelper()
    expect(settings).toHaveProperty('owner')
    expect(settings).toHaveProperty('name')
    expect(Object.keys(settings)).toEqual(['owner', 'name'])
  })
})
