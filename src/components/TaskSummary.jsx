import React from 'react'

/**
 * Summary bar: total, active, completed, overdue counts.
 * Props: stats – { total, active, completed, overdue }
 */
export default function TaskSummary({ stats }) {
  return (
    <div className="summary" role="status" aria-live="polite" aria-label="Task summary">
      <span className="summary__item">
        <span className="summary__count">{stats.total}</span> total
      </span>
      <span className="summary__item">
        <span className="summary__count">{stats.active}</span> active
      </span>
      <span className="summary__item">
        <span className="summary__count">{stats.completed}</span> done
      </span>
      {stats.overdue > 0 && (
        <span className="summary__item summary__item--overdue">
          <span className="summary__count">{stats.overdue}</span> overdue
        </span>
      )}
    </div>
  )
}
