export default function ReusableForm({ fields, values, onChange, onSubmit, onCancel, submitLabel = 'Save' }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    onChange(name, type === 'number' ? (value === '' ? '' : Number(value)) : value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.fullWidth ? 'sm:col-span-2' : ''}>
            <label htmlFor={field.name} className="form-label">
              {field.label}
              {field.required && <span className="text-red-400"> *</span>}
            </label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={values[field.name] ?? ''}
                onChange={handleChange}
                required={field.required}
                disabled={field.disabled}
                className="input-field"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={values[field.name] ?? ''}
                onChange={handleChange}
                required={field.required}
                disabled={field.disabled}
                rows={field.rows || 4}
                className="input-field resize-none"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type || 'text'}
                value={values[field.name] ?? ''}
                onChange={handleChange}
                required={field.required}
                disabled={field.disabled}
                className="input-field"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-700/60 pt-6">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
