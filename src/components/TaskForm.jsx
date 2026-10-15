import { useState, useEffect } from 'react'

const EMPTY = { title: '', description: '', priority: 'medium', dueDate: '' }

/**
 * Controlled create/edit form.
 * Props:
 *   initial  – task object when editing, null when creating
 *   onSubmit – fn(formData)
 *   onCancel – fn()
 */
export default function TaskForm({ initial = null, onSubmit, onCancel }) {
  const [fields, setFields] = useState(initial ? {
    title: initial.title,
    description: initial.description,
    priority: initial.priority,
    dueDate: initial.dueDate,
  } : EMPTY)
  const [error, setError] = useState('')

  // Sync when switching from create to edit
  useEffect(() => {
    setFields(initial ? {
      title: initial.title,
      description: initial.description,
      priority: initial.priority,
      dueDate: initial.dueDate,
    } : EMPTY)
    setError('')
  }, [initial])

  function set(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (key === 'title') setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!fields.title.trim()) {
      setError('Title is required.')
      return
    }
    onSubmit(fields)
  }

  const isEdit = Boolean(initial)

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      <h2 className="task-form__title">{isEdit ? 'Edit task' : 'New task'}</h2>

      <div className="field">
        <label htmlFor="tf-title">Title <span aria-hidden="true">*</span></label>
        <input
          id="tf-title"
          type="text"
          value={fields.title}
          onChange={(e) => set('title', e.target.value)}
          maxLength={120}
          aria-required="true"
          aria-describedby={error ? 'tf-title-error' : undefined}
          autoFocus
        />
        {error && (
          <span id="tf-title-error" role="alert" className="field__error">
            {error}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="tf-desc">Description</label>
        <textarea
          id="tf-desc"
          value={fields.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="tf-priority">Priority</label>
          <select
            id="tf-priority"
            value={fields.priority}
            onChange={(e) => set('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="tf-due">Due date</label>
          <input
            id="tf-due"
            type="date"
            value={fields.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
          />
        </div>
      </div>

      <div className="task-form__actions">
        <button type="submit" className="btn btn--primary">
          {isEdit ? 'Save changes' : 'Add task'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
