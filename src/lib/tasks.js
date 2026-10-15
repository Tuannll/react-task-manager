const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

/**
 * Validate and normalise raw form data into a Task object.
 * Throws if title is blank.
 */
export function createTask(data, { id = crypto.randomUUID(), now = new Date().toISOString() } = {}) {
  const title = (data.title ?? '').trim()
  if (!title) throw new Error('Task title is required.')

  return {
    id,
    title,
    description: (data.description ?? '').trim(),
    priority: ['low', 'medium', 'high'].includes(data.priority) ? data.priority : 'medium',
    dueDate: data.dueDate ?? '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
}

/** Return new array with one task replaced. Immutable. */
export function updateTask(tasks, id, changes, now = new Date().toISOString()) {
  return tasks.map((t) =>
    t.id === id ? { ...t, ...changes, id, updatedAt: now } : t,
  )
}

/** Toggle completed flag. Immutable. */
export function toggleTask(tasks, id, now = new Date().toISOString()) {
  return tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t,
  )
}

/** Remove task by id. Immutable. */
export function deleteTask(tasks, id) {
  return tasks.filter((t) => t.id !== id)
}

/**
 * Parse localStorage raw string.
 * Returns { tasks, recovered: false } on success.
 * Returns { tasks: [], recovered: true } on corrupt data.
 */
export function loadTasks(raw) {
  if (!raw) return { tasks: [], recovered: false }
  try {
    const parsed = JSON.parse(raw)
    const tasks = Array.isArray(parsed) ? parsed : []
    return { tasks, recovered: false }
  } catch {
    return { tasks: [], recovered: true }
  }
}

/** Serialize tasks for localStorage. */
export function saveTasks(tasks) {
  return JSON.stringify(tasks)
}

/**
 * Filter, search and sort tasks.
 * filters: { status: 'all'|'active'|'completed', priority: 'all'|'low'|'medium'|'high', query: string, sort: 'created'|'due-date'|'priority' }
 */
export function filterTasks(tasks, { status = 'all', priority = 'all', query = '', sort = 'created' } = {}) {
  let result = tasks.filter((t) => {
    if (status === 'active' && t.completed) return false
    if (status === 'completed' && !t.completed) return false
    if (priority !== 'all' && t.priority !== priority) return false
    if (query) {
      const q = query.toLowerCase()
      if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false
    }
    return true
  })

  result = [...result].sort((a, b) => {
    if (sort === 'due-date') {
      // Tasks without due date go last
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    }
    if (sort === 'priority') {
      return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
    }
    // default: created (ascending)
    return a.createdAt.localeCompare(b.createdAt)
  })

  return result
}

/**
 * Derive summary counts from task list.
 * today: 'YYYY-MM-DD' string for overdue comparison.
 */
export function getTaskStats(tasks, today = new Date().toISOString().slice(0, 10)) {
  let active = 0
  let completed = 0
  let overdue = 0

  for (const t of tasks) {
    if (t.completed) {
      completed++
    } else {
      active++
      if (t.dueDate && t.dueDate < today) overdue++
    }
  }

  return { total: tasks.length, active, completed, overdue }
}
