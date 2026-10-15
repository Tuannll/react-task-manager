import React from 'react'

/**
 * Toolbar: search + status/priority filter + sort.
 * Props:
 *   filters  – { status, priority, query, sort }
 *   onChange – fn(key, value)
 *   onClear  – fn()   (clear all filters)
 */
export default function TaskToolbar({ filters, onChange, onClear }) {
  const hasFilter =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.query !== '' ||
    filters.sort !== 'created'

  return (
    <div className="toolbar" role="search">
      <div className="toolbar__search">
        <label htmlFor="tb-search" className="sr-only">Search tasks</label>
        <input
          id="tb-search"
          type="search"
          placeholder="Search tasks…"
          value={filters.query}
          onChange={(e) => onChange('query', e.target.value)}
          className="toolbar__input"
        />
      </div>

      <div className="toolbar__controls">
        <div className="toolbar__control">
          <label htmlFor="tb-status">Status</label>
          <select
            id="tb-status"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="toolbar__control">
          <label htmlFor="tb-priority">Priority</label>
          <select
            id="tb-priority"
            value={filters.priority}
            onChange={(e) => onChange('priority', e.target.value)}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="toolbar__control">
          <label htmlFor="tb-sort">Sort</label>
          <select
            id="tb-sort"
            value={filters.sort}
            onChange={(e) => onChange('sort', e.target.value)}
          >
            <option value="created">Date created</option>
            <option value="due-date">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {hasFilter && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
