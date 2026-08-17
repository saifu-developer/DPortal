import { useEffect, useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/layout/Modal';
import ReportUploadForm from '../../components/forms/ReportUploadForm';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';
import { getReportsByPatient, uploadReport, downloadReport } from '../../services/reportService';

export default function PatientReports() {
  const { auth } = useAuth();
  const { showAlert } = useDialog();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewUrl, setViewUrl] = useState(null);
  const [viewReport, setViewReport] = useState(null);

  const fetchReports = async () => {
    if (!auth?.patientId) return;
    setLoading(true);
    try {
      const res = await getReportsByPatient(auth.patientId);
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [auth?.patientId]);

  const handleUpload = async (formData) => {
    try {
      formData.set('patientId', auth.patientId);
      await uploadReport(formData);
      setUploadOpen(false);
      await fetchReports();
      await showAlert('Report uploaded successfully.', 'Success');
    } catch (err) {
      const message = err.response?.data || 'Failed to upload report.';
      await showAlert(typeof message === 'string' ? message : 'Failed to upload report.');
    }
  };

  const handleDownload = async (report) => {
    try {
      const res = await downloadReport(report.id);
      const ext = report.filePath?.split('.').pop() || 'file';
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.reportName}.${ext}`);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      await showAlert('Failed to download report.');
    }
  };

  const handleView = async (report) => {
    try {
      const res = await downloadReport(report.id);
      const ext = report.filePath?.split('.').pop()?.toLowerCase() || '';
      const mime = ext === 'pdf' ? 'application/pdf' : 'image/*';
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mime }));
      setViewUrl(url);
      setViewReport(report);
    } catch {
      await showAlert('Failed to view report.');
    }
  };

  const closeView = () => {
    if (viewUrl) window.URL.revokeObjectURL(viewUrl);
    setViewUrl(null);
    setViewReport(null);
  };

  const columns = [
    { key: 'reportName', label: 'Report' },
    { key: 'reportType', label: 'Type' },
    { key: 'uploadDate', label: 'Upload Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => handleView(row)} className="btn-secondary py-1 text-xs">
            View
          </button>
          <button type="button" onClick={() => handleDownload(row)} className="btn-secondary py-1 text-xs">
            Download
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">My Reports</h2>
          <p className="mt-1 text-sm text-slate-400">View, download, and upload medical reports (PDF, JPG, PNG)</p>
        </div>
        <button type="button" onClick={() => setUploadOpen(true)} className="btn-primary">
          + Upload Report
        </button>
      </div>
      <div className="card overflow-hidden p-0">
        <DataTable columns={columns} data={reports} loading={loading} emptyMessage="No reports uploaded." />
      </div>

      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Report">
        <ReportUploadForm
          patients={[{ id: auth.patientId, fullName: auth.fullName, patientCode: '' }]}
          initialValues={{ patientId: auth.patientId }}
          requireFile
          submitLabel="Upload"
          onSubmit={handleUpload}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!viewReport} onClose={closeView} title={viewReport?.reportName || 'View Report'}>
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
