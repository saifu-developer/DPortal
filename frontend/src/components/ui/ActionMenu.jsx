import { useEffect, useRef, useState } from 'react';

export default function ActionMenu({ items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (!items?.length) return null;

  return (
    <div className="relative inline-flex items-center gap-2" ref={menuRef}>
      {items.slice(0, 1).map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            item.onClick?.();
            setOpen(false);
          }}
          className="btn-secondary btn-sm"
        >
          {item.label}
        </button>
      ))}

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="btn-icon"
            aria-label="More actions"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="text-base leading-none">⋮</span>
          </button>

          {open && (
            <div
              role="menu"
              className={`absolute top-full z-20 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-slate-600/80 bg-surface-raised py-1.5 shadow-xl shadow-black/30 ${
                align === 'right' ? 'right-0' : 'left-0'
              }`}
            >
              {items.slice(1).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-surface-overlay focus:bg-surface-overlay focus:outline-none ${
                    item.variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
