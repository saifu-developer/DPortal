import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/layout/Modal';
import { getReports, downloadReport } from '../../services/reportService';
import { getPatients } from '../../services/patientService';

export default function StaffReports() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewUrl, setViewUrl] = useState(null);
  const [viewReport, setViewReport] = useState(null);

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p.fullName])),
    [patients]
  );

  useEffect(() => {
    Promise.all([getReports(), getPatients()])
      .then(([r, p]) => {
        setReports(r.data || []);
        setPatients(p.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (report) => {
    const res = await downloadReport(report.id);
    const ext = report.filePath?.split('.').pop()?.toLowerCase() || '';
    const mime = ext === 'pdf' ? 'application/pdf' : 'image/*';
    const url = window.URL.createObjectURL(new Blob([res.data], { type: mime }));
    setViewUrl(url);
    setViewReport(report);
  };

  const handleDownload = async (report) => {
    const res = await downloadReport(report.id);
    const ext = report.filePath?.split('.').pop() || 'file';
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.reportName}.${ext}`);
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const closeView = () => {
    if (viewUrl) window.URL.revokeObjectURL(viewUrl);
    setViewUrl(null);
    setViewReport(null);
  };

  const columns = [
    { key: 'reportName', label: 'Report' },
    { key: 'reportType', label: 'Type' },
    { key: 'patientId', label: 'Patient', render: (row) => patientMap[row.patientId] || row.patientId },
    { key: 'uploadDate', label: 'Upload Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => handleView(row)} className="btn-secondary py-1 text-xs">View</button>
          <button type="button" onClick={() => handleDownload(row)} className="btn-secondary py-1 text-xs">Download</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Medical Reports</h2>
        <p className="text-sm text-slate-400">View-only access</p>
      </div>
      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={reports} loading={loading} />
      </div>
      <Modal isOpen={!!viewReport} onClose={closeView} title={viewReport?.reportName || 'Report'}>
        {viewReport && viewUrl && (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-slate-500">Type:</span>{' '}
                <span className="text-white">{viewReport.reportType}</span>
              </div>
              <div>
                <span className="text-slate-500">Upload Date:</span>{' '}
                <span className="text-white">{viewReport.uploadDate}</span>
              </div>
            </div>
            {viewReport.filePath?.toLowerCase().endsWith('.pdf') ? (
              <iframe src={viewUrl} title="Report" className="h-96 w-full rounded-lg border border-slate-700" />
            ) : (
              <img src={viewUrl} alt={viewReport.reportName} className="max-h-96 w-full object-contain" />
            )}
            <div className="flex justify-end gap-3 border-t border-slate-700/60 pt-4">
              <button type="button" onClick={() => handleDownload(viewReport)} className="btn-primary">
                Download
              </button>
              <button type="button" onClick={closeView} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
