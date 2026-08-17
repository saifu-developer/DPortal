import { useNavigate } from 'react-router-dom';

export default function StatCard({ title, value, icon, accent = 'teal', to, onClick, description }) {
  const navigate = useNavigate();

  const accentClasses = {
    teal: 'bg-teal-500/10 text-teal-400 ring-teal-500/20',
    blue: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
    purple: 'bg-violet-500/10 text-violet-400 ring-violet-500/20',
    amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  };

  const clickable = !!(to || onClick);

  const handleClick = () => {
    if (onClick) onClick();
    else if (to) navigate(to);
  };

  const Wrapper = clickable ? 'button' : 'div';

  return (
    <Wrapper
      type={clickable ? 'button' : undefined}
      onClick={clickable ? handleClick : undefined}
      className={`card group flex w-full items-start justify-between gap-4 text-left transition-all duration-200 ${
        clickable
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5'
          : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-3 text-4xl font-bold tracking-tight text-white">{value ?? '—'}</p>
        {description && <p className="mt-2 text-xs text-slate-500">{description}</p>}
      </div>
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-105 ${
          accentClasses[accent] || accentClasses.teal
        }`}
      >
        {icon}
      </div>
    </Wrapper>
  );
}
