export default function InfoCard({ title, children, action, noPadding = false }) {
  return (
    <div className={`card ${noPadding ? 'p-0 overflow-hidden' : ''}`}>
      {title && (
        <div className={`flex items-center justify-between ${noPadding ? 'border-b border-slate-700/50 px-6 py-5' : 'mb-5'}`}>
          <h2 className="section-title">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
