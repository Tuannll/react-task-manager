/**
 * Empty state for two situations:
 *   variant='no-tasks'  – no tasks exist yet, prompt to create
 *   variant='no-match'  – filters produced no results, prompt to clear
 * Props:
 *   variant  – 'no-tasks' | 'no-match'
 *   onAction – fn()  (open form or clear filters)
 */
export default function EmptyState({ variant, onAction }) {
  if (variant === 'no-match') {
    return (
      <div className="empty-state" role="status">
        <p className="empty-state__msg">No tasks match your filters.</p>
        <button type="button" className="btn btn--ghost" onClick={onAction}>
          Clear filters
        </button>
      </div>
    )
  }

  return (
    <div className="empty-state" role="status">
      <p className="empty-state__msg">No tasks yet. Create your first one.</p>
      <button type="button" className="btn btn--primary" onClick={onAction}>
        Add task
      </button>
    </div>
  )
}
