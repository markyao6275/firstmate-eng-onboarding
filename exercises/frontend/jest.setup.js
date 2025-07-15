import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3001'

// Mock console.error to prevent noise in tests unless we expect it
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
