import { useState } from 'react';

const reportTypes = [
  { value: 'Lab', label: 'Lab Report' },
  { value: 'X-Ray', label: 'X-Ray' },
  { value: 'MRI', label: 'MRI' },
  { value: 'CT Scan', label: 'CT Scan' },
  { value: 'Blood Test', label: 'Blood Test' },
  { value: 'Other', label: 'Other' },
];

export default function ReportUploadForm({
  patients,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Upload Report',
  requireFile = true,
}) {
  const [form, setForm] = useState({
    patientId: initialValues.patientId ?? '',
    reportType: initialValues.reportType ?? '',
    notes: initialValues.notes ?? '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.patientId || !form.reportType) {
      setError('Please select a patient and report type.');
      return;
    }
    if (requireFile && !file) {
      setError('Please select a PDF or image file.');
      return;
    }

    const formData = new FormData();
    formData.append('patientId', form.patientId);
    formData.append('reportType', form.reportType);
    formData.append('notes', form.notes || '');
    if (file) {
      formData.append('file', file);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="patientId" className="mb-1.5 block text-sm font-medium text-slate-300">
            Patient <span className="text-red-400">*</span>
          </label>
          <select
            id="patientId"
            value={form.patientId}
            onChange={(e) => setForm((prev) => ({ ...prev, patientId: e.target.value }))}
            required
            className="input-field"
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.patientCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="reportType" className="mb-1.5 block text-sm font-medium text-slate-300">
            Report Type <span className="text-red-400">*</span>
          </label>
          <select
            id="reportType"
            value={form.reportType}
            onChange={(e) => setForm((prev) => ({ ...prev, reportType: e.target.value }))}
            required
            className="input-field"
          >
            <option value="">Select type</option>
            {reportTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-300">
            Notes
          </label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="input-field resize-none"
            placeholder="Optional notes..."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-slate-300">
            File {requireFile && <span className="text-red-400">*</span>}
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-accent/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/30"
          />
          <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG, GIF, or WEBP (max 10MB)</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-700/60 pt-4">
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
