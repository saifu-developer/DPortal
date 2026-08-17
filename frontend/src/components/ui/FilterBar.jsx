export default function FilterBar({ children, onReset, showReset = false }) {
  return (
    <div className="filter-bar">
      <div className="grid gap-4 lg:grid-cols-12">{children}</div>
      {showReset && onReset && (
        <div className="mt-4 flex justify-end border-t border-slate-700/40 pt-4">
          <button type="button" onClick={onReset} className="btn-secondary btn-sm">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export function FilterField({ label, children, className = 'lg:col-span-3' }) {
  return (
    <div className={className}>
      {label && <label className="form-label">{label}</label>}
      {children}
    </div>
  );
}
