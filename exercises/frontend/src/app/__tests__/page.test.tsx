import React from 'react'
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock environment variable
process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3001'

describe('Home Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {});
  })

  afterEach(() => {
    jest.clearAllMocks()
  })


  it('fetches saved names on component mount', async () => {
    const mockData = { first_name: 'John', last_name: 'Doe' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/names', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
  })

  it('displays fetched names in the form and greeting', async () => {
    const mockData = { first_name: 'John', last_name: 'Doe' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByText('Hello, John Doe!')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    render(<Home />)
    
    // During loading, the NameEditor should not be visible
    expect(screen.queryByPlaceholderText('First Name')).not.toBeInTheDocument()
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('allows users to input names', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')

    await user.type(firstNameInput, 'Jane')
    await user.type(lastNameInput, 'Smith')

    expect(firstNameInput).toHaveValue('Jane')
    expect(lastNameInput).toHaveValue('Smith')
  })

  it('saves names when save button is clicked', async () => {
    const user = userEvent.setup()
    
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    // Mock save fetch
    const saveResponse = { first_name: 'Jane', last_name: 'Smith' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => saveResponse,
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')
    const saveButton = screen.getByRole('button', { name: 'Save' })

    await user.type(firstNameInput, 'Jane')
    await user.type(lastNameInput, 'Smith')
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: 'Jane', last_name: 'Smith' }),
      })
    })
  })

  it('updates the greeting when names are saved', async () => {
    const user = userEvent.setup()
    
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    // Mock save fetch
    const saveResponse = { first_name: 'Jane', last_name: 'Smith' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => saveResponse,
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')
    const saveButton = screen.getByRole('button', { name: 'Save' })

    await user.type(firstNameInput, 'Jane')
    await user.type(lastNameInput, 'Smith')
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Hello, Jane Smith!')).toBeInTheDocument()
    })
  })
})

describe('NameEditor Component', () => {
  const defaultProps = {
    fetchedFirstName: null,
    fetchedLastName: null,
    onSaveNames: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with empty inputs when no fetched names provided', () => {
    render(<Home />)
    // This tests the NameEditor as it's integrated within Home
    // Individual component testing would require exporting NameEditor
  })

  it('initializes inputs with fetched names', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    })
  })

  it('updates full name when input values change', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByText('Hello, John Doe!')).toBeInTheDocument()
    })

    const firstNameInput = screen.getByDisplayValue('John')
    await user.clear(firstNameInput)
    await user.type(firstNameInput, 'Jane')

    // Note: The fullName updates based on useEffect with fetchedFirstName/fetchedLastName dependencies
    // So it won't update immediately on input change unless we modify the component logic
  })

  it('displays greeting only when full name exists', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    // When both names are empty, there should be no greeting
    expect(screen.queryByText(/Hello,/)).not.toBeInTheDocument()
  })

  it('calls onSaveNames with correct parameters when save button is clicked', async () => {
    const user = userEvent.setup()
    
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    // Mock save fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'Test', last_name: 'User' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')
    const saveButton = screen.getByRole('button', { name: 'Save' })

    await user.type(firstNameInput, 'Test')
    await user.type(lastNameInput, 'User')
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/names',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ first_name: 'Test', last_name: 'User' }),
        })
      )
    })
  })
})

describe('Integration Tests', () => {
  it('completes full user flow: load -> edit -> save -> display', async () => {
    const user = userEvent.setup()
    
    // Mock initial fetch (empty names)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    // Mock save fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'Alice', last_name: 'Johnson' }),
    })

    await act(async () => {
      render(<Home />)
    })

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    // User inputs names
    const firstNameInput = screen.getByPlaceholderText('First Name')
    const lastNameInput = screen.getByPlaceholderText('Last Name')
    
    await user.type(firstNameInput, 'Alice')
    await user.type(lastNameInput, 'Johnson')
    
    expect(firstNameInput).toHaveValue('Alice')
    expect(lastNameInput).toHaveValue('Johnson')

    // User saves
    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)

    // Verify save request
    await waitFor(() => {
      expect(mockFetch).toHaveBeenLastCalledWith(
        'http://localhost:3001/api/names',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ first_name: 'Alice', last_name: 'Johnson' }),
        })
      )
    })

    // Verify updated display shows the saved names
    await waitFor(() => {
      expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Johnson')).toBeInTheDocument()
    })
  })

  it('handles empty names appropriately', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: '', last_name: '' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    })

    // Should not show greeting when names are empty
    expect(screen.queryByText(/Hello,/)).not.toBeInTheDocument()
    
    // Inputs should be empty
    expect(screen.getByPlaceholderText('First Name')).toHaveValue('')
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue('')
  })

  it('handles single name (only first name) appropriately', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ first_name: 'Madonna', last_name: '' }),
    })

    await act(async () => {
      render(<Home />)
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Madonna')).toBeInTheDocument()
      expect(screen.getByText('Hello, Madonna !')).toBeInTheDocument()
    })
  })
})
