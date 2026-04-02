/**
 * Mock action input configurations for testing
 */

export const validInputs = {
  'category-position': '2',
  body: 'Test discussion body',
  title: 'Test Discussion Title',
  token: 'test-token'
}

export const minimalInputs = {
  'category-position': '1',
  body: 'Body',
  title: 'Title',
  token: 'token'
}

/**
 * Creates a mock getInput function that returns values from an inputs object
 * @param {Object} inputs - Object mapping input names to values
 * @returns {Function} Mock function for core.getInput
 */
export function createGetInputMock(inputs) {
  return input => inputs[input] || ''
}
