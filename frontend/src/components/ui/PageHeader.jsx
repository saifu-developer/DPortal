export default function PageHeader({ title, subtitle, action, badge }) {
  return (
    <div className="flex flex-col gap-6 pb-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="admin-page-title">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="admin-page-subtitle max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
