import EmptyState from '../ui/EmptyState';
import TableSkeleton from '../ui/TableSkeleton';

export default function DataTable({
  columns,
  data,
  loading,
  emptyMessage = 'No records found.',
  emptyIcon = 'default',
  emptyAction,
}) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="md:hidden space-y-3 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-700/50 bg-surface p-4">
              <div className="mb-3 h-4 w-1/3 rounded bg-slate-700/50" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-700/40" />
                <div className="h-3 w-2/3 rounded bg-slate-700/40" />
              </div>
            </div>
          ))}
        </div>
        <TableSkeleton columns={columns} />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="table-container">
        <EmptyState
          title={emptyMessage}
          description="Try adjusting your search or filters to find what you need."
          icon={emptyIcon}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div className="table-container">
      {/* Mobile card list */}
      <div className="space-y-3 p-4 md:hidden">
        {data.map((row, index) => (
          <div
            key={row.id ?? index}
            className="rounded-xl border border-slate-700/50 bg-surface p-5 transition hover:border-slate-600"
          >
            <dl className="space-y-3">
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{col.label}</dt>
                  <dd className="text-[15px] text-slate-200 sm:text-right">
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden max-h-[calc(100vh-20rem)] overflow-auto md:block">
        <table className="w-full min-w-[640px] text-left">
          <thead className="sticky top-0 z-10 bg-surface-overlay/95 backdrop-blur-sm">
            <tr className="border-b border-slate-700/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-400"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id ?? index}
                className="border-b border-slate-700/30 transition hover:bg-accent/[0.04] even:bg-surface/30"
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-5 py-4 text-[15px] text-slate-300">
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
