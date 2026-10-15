import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

// Isolate localStorage between tests
beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('App integration', () => {
  it('shows empty state when no tasks exist', () => {
    render(<App />)
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument()
  })

  it('creates a task and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Write tests')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('shows validation error for blank title', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    // submit without filling title
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/title is required/i)
  })

  it('toggles task completion', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Create task first
    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Toggle me')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    const checkbox = screen.getByRole('checkbox', { name: /mark "toggle me" complete/i })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('edits a task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Original title')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /edit task: original title/i }))
    const titleInput = within(screen.getByRole('dialog')).getByLabelText(/title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated title')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(screen.getByText('Updated title')).toBeInTheDocument()
    expect(screen.queryByText('Original title')).not.toBeInTheDocument()
  })

  it('deletes a task after confirmation', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Delete me')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /delete task: delete me/i }))
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('does not delete if confirmation is cancelled', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Keep me')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /delete task: keep me/i }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
  })

  it('persists tasks to localStorage and reloads them', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Persisted task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    unmount()
    render(<App />)
    expect(screen.getByText('Persisted task')).toBeInTheDocument()
  })

  it('shows recovery notice when localStorage has corrupt data', () => {
    localStorage.setItem('task-manager-v1', '{broken json')
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent(/unreadable/i)
  })

  it('filters active tasks correctly', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Create two tasks, complete one
    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Active task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Done task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('checkbox', { name: /mark "done task" complete/i }))

    // Filter to active only
    await user.selectOptions(screen.getByLabelText(/status/i), 'active')
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
  })

  it('shows no-match empty state when filters produce no results', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Low priority task')
    const prioritySelect = within(screen.getByRole('dialog', { hidden: true })).getByLabelText(/priority/i)
    await user.selectOptions(prioritySelect, 'low')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    // Filter to high priority
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    expect(screen.getByText(/no tasks match/i)).toBeInTheDocument()
  })

  it('updates summary counts accurately', async () => {
    const user = userEvent.setup()
    render(<App />)

    const summary = () => screen.getByRole('status', { name: /task summary/i })
    expect(summary()).toHaveTextContent(/^0 total/)

    await user.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await user.type(screen.getByLabelText(/title/i), 'Count me')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(summary()).toHaveTextContent(/^1 total/)
  })
})
