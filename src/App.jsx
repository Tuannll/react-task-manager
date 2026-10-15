import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  loadTasks,
  saveTasks,
  filterTasks,
  getTaskStats,
} from './lib/tasks.js'
import TaskForm from './components/TaskForm.jsx'
import TaskToolbar from './components/TaskToolbar.jsx'
import TaskList from './components/TaskList.jsx'
import TaskSummary from './components/TaskSummary.jsx'
import EmptyState from './components/EmptyState.jsx'
import './App.css'

const STORAGE_KEY = 'task-manager-v1'
const DEFAULT_FILTERS = { status: 'all', priority: 'all', query: '', sort: 'created' }
const today = () => new Date().toISOString().slice(0, 10)

export default function App() {
  const [initialData] = useState(() => loadTasks(localStorage.getItem(STORAGE_KEY)))
  const [tasks, setTasks] = useState(initialData.tasks)
  const [recovered] = useState(initialData.recovered)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)

  // Persist whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, saveTasks(tasks))
  }, [tasks])

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  function openCreate() {
    triggerRef.current = document.activeElement
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEdit(task) {
    triggerRef.current = document.activeElement
    setEditingTask(task)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingTask(null)
    setTimeout(() => triggerRef.current?.focus(), 0)
  }

  // Focus trap + Escape when dialog open
  useEffect(() => {
    if (!formOpen) return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    function handleKey(e) {
      if (e.key === 'Escape') { closeForm(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    dialog.addEventListener('keydown', handleKey)
    return () => dialog.removeEventListener('keydown', handleKey)
  }, [formOpen]) // closeForm is stable (no deps)

  function handleSubmit(formData) {
    if (editingTask) {
      setTasks((prev) => updateTask(prev, editingTask.id, formData))
    } else {
      setTasks((prev) => [...prev, createTask(formData)])
    }
    closeForm()
  }

  function handleToggle(id) {
    setTasks((prev) => toggleTask(prev, id))
  }

  function handleDelete(id, title) {
    if (window.confirm(`Delete task "${title}"? This cannot be undone.`)) {
      setTasks((prev) => deleteTask(prev, id))
    }
  }

  const visible = filterTasks(tasks, filters)
  const stats = getTaskStats(tasks, today())

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__heading">Task Manager</h1>
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          Add task
        </button>
      </header>

      {recovered && (
        <div role="alert" className="alert alert--warning">
          Saved data was unreadable and has been reset. Your previous tasks could not be recovered.
        </div>
      )}

      <TaskSummary stats={stats} />

      <TaskToolbar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />

      <main>
        {formOpen && (
          <div
            className="dialog-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={editingTask ? 'Edit task' : 'New task'}
            onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}
          >
            <div className="dialog" ref={dialogRef}>
              <TaskForm key={editingTask?.id ?? 'create'} initial={editingTask} onSubmit={handleSubmit} onCancel={closeForm} />
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <EmptyState variant="no-tasks" onAction={openCreate} />
        ) : visible.length === 0 ? (
          <EmptyState variant="no-match" onAction={clearFilters} />
        ) : (
          <TaskList
            tasks={visible}
            today={today()}
            onToggle={handleToggle}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <footer className="app__footer">
        <p>Tasks saved in this browser. Clearing site data will delete all tasks.</p>
      </footer>
    </div>
  )
}
