import React from 'react'

/**
 * Task list.
 * Props:
 *   tasks    – filtered, sorted task array
 *   today    – 'YYYY-MM-DD' for overdue highlight
 *   onToggle – fn(id)
 *   onEdit   – fn(task)
 *   onDelete – fn(id, title)
 */
export default function TaskList({ tasks, today, onToggle, onEdit, onDelete }) {
  return (
    <ul className="task-list" aria-label="Tasks">
      {tasks.map((task) => {
        const overdue = !task.completed && task.dueDate && task.dueDate < today
        return (
          <li key={task.id} className={`task-card${task.completed ? ' task-card--done' : ''}${overdue ? ' task-card--overdue' : ''}`}>
            <div className="task-card__check">
              <input
                type="checkbox"
                id={`done-${task.id}`}
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
              />
            </div>

            <div className="task-card__body">
              <label htmlFor={`done-${task.id}`} className="task-card__title">
                {task.title}
              </label>
              {task.description && (
                <p className="task-card__desc">{task.description}</p>
              )}
              <div className="task-card__meta">
                <span className={`badge badge--${task.priority}`} aria-label={`Priority: ${task.priority}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className={`task-card__due${overdue ? ' task-card__due--overdue' : ''}`}>
                    {overdue ? 'Overdue: ' : 'Due: '}{task.dueDate}
                  </span>
                )}
              </div>
            </div>

            <div className="task-card__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => onEdit(task)}
                aria-label={`Edit task: ${task.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => onDelete(task.id, task.title)}
                aria-label={`Delete task: ${task.title}`}
              >
                Delete
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
