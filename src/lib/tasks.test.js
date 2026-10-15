import { describe, expect, it } from 'vitest'
import {
  createTask,
  deleteTask,
  filterTasks,
  getTaskStats,
  loadTasks,
  toggleTask,
  updateTask,
} from './tasks.js'

describe('task helpers', () => {
  it('creates a normalized task from valid form data', () => {
    const task = createTask(
      { title: '  Ship app  ', description: '  Verify task flow  ', priority: 'high', dueDate: '2026-10-20' },
      { id: 'task-1', now: '2026-10-15T09:00:00.000Z' },
    )

    expect(task).toEqual({
      id: 'task-1',
      title: 'Ship app',
      description: 'Verify task flow',
      priority: 'high',
      dueDate: '2026-10-20',
      completed: false,
      createdAt: '2026-10-15T09:00:00.000Z',
      updatedAt: '2026-10-15T09:00:00.000Z',
    })
  })

  it('rejects a whitespace-only title', () => {
    expect(() => createTask({ title: '   ' })).toThrow('Task title is required.')
  })

  it('recovers from corrupt stored data', () => {
    expect(loadTasks('{broken')).toEqual({ tasks: [], recovered: true })
  })

  it('updates, toggles, and deletes without mutating existing tasks', () => {
    const tasks = [
      createTask({ title: 'Write tests' }, { id: 'task-1', now: '2026-10-15T09:00:00.000Z' }),
    ]
    const updated = updateTask(tasks, 'task-1', { title: 'Write stronger tests' }, '2026-10-15T10:00:00.000Z')
    const toggled = toggleTask(updated, 'task-1', '2026-10-15T11:00:00.000Z')

    expect(tasks[0].title).toBe('Write tests')
    expect(toggled[0]).toMatchObject({ title: 'Write stronger tests', completed: true })
    expect(deleteTask(toggled, 'task-1')).toEqual([])
  })

  it('updateTask ignores id field in changes', () => {
    const tasks = [
      createTask({ title: 'Original' }, { id: 'real-id', now: '2026-10-15T00:00:00.000Z' }),
    ]
    const result = updateTask(tasks, 'real-id', { id: 'injected-id', title: 'Patched' }, '2026-10-15T01:00:00.000Z')
    expect(result[0].id).toBe('real-id')
    expect(result[0].title).toBe('Patched')
  })

  it('filters, sorts, and derives overdue summary data', () => {
    const tasks = [
      { id: 'a', title: 'Later task', description: '', priority: 'low', dueDate: '2026-10-20', completed: false, createdAt: '2026-10-01T00:00:00.000Z', updatedAt: '2026-10-01T00:00:00.000Z' },
      { id: 'b', title: 'Overdue task', description: '', priority: 'high', dueDate: '2026-10-10', completed: false, createdAt: '2026-10-02T00:00:00.000Z', updatedAt: '2026-10-02T00:00:00.000Z' },
      { id: 'c', title: 'Done task', description: '', priority: 'medium', dueDate: '', completed: true, createdAt: '2026-10-03T00:00:00.000Z', updatedAt: '2026-10-03T00:00:00.000Z' },
    ]

    expect(filterTasks(tasks, { status: 'active', priority: 'all', query: '', sort: 'due-date' }).map((task) => task.id)).toEqual(['b', 'a'])
    expect(getTaskStats(tasks, '2026-10-15')).toEqual({ total: 3, active: 2, completed: 1, overdue: 1 })
  })
})
