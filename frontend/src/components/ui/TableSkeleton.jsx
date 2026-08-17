function SkeletonRow({ columns }) {
  return (
    <tr className="border-b border-slate-700/30">
      {columns.map((col) => (
        <td key={col.key} className="px-5 py-4">
          <div className="h-4 animate-pulse rounded-md bg-slate-700/50" />
        </td>
      ))}
    </tr>
  );
}

export default function TableSkeleton({ columns, rows = 5 }) {
  return (
    <div className="hidden md:block">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-700/60 bg-surface-overlay/40">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-4">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-700/50" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
