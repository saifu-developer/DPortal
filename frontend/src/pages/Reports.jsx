import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/layout/Modal';
import ReportUploadForm from '../components/forms/ReportUploadForm';
import { useDialog } from '../context/DialogContext';
import { getPatients } from '../services/patientService';
import {
  getReports,
  getReportsByPatient,
  uploadReport,
  updateReport,
  downloadReport,
  deleteReport,
} from '../services/reportService';

export default function Reports() {
  const { showAlert, showConfirm } = useDialog();
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientFilter, setPatientFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUrl, setViewUrl] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p.fullName])),
    [patients]
  );

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data || []);
    } catch (err) {
      console.error('Failed to load patients', err);
    }
  };

  const fetchReports = async (patientId = patientFilter) => {
    setLoading(true);
    try {
      const res = patientId
        ? await getReportsByPatient(patientId)
        : await getReports();
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [patientFilter]);

  const openUpload = () => {
    setEditingReport(null);
    setModalOpen(true);
  };

  const openEdit = (report) => {
    setEditingReport(report);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingReport) {
        await updateReport(editingReport.id, formData);
        setModalOpen(false);
        await fetchReports();
        await showAlert('Report updated successfully.', 'Success');
      } else {
        await uploadReport(formData);
        setModalOpen(false);
        await fetchReports();
        await showAlert('Report uploaded successfully.', 'Success');
      }
    } catch (err) {
      const message = err.response?.data || 'Failed to save report.';
      await showAlert(typeof message === 'string' ? message : 'Failed to save report.');
    }
  };

  const handleDownload = async (report) => {
    try {
      const res = await downloadReport(report.id);
      const extension = report.filePath?.split('.').pop() || 'file';
      const fileName = `${report.reportName.replace(/\s+/g, '_')}.${extension}`;
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report', err);
      await showAlert('Failed to download report.');
    }
  };

  const handleView = async (report) => {
    try {
      const res = await downloadReport(report.id);
      const extension = report.filePath?.split('.').pop()?.toLowerCase() || '';
      const mimeType = extension === 'pdf' ? 'application/pdf' : res.headers['content-type'] || 'image/*';
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mimeType }));
      setViewUrl(url);
      setViewReport(report);
      setViewModalOpen(true);
    } catch (err) {
      console.error('Failed to view report', err);
      await showAlert('Failed to view report.');
    }
  };

  const closeViewModal = () => {
    if (viewUrl) window.URL.revokeObjectURL(viewUrl);
    setViewUrl(null);
    setViewReport(null);
    setViewModalOpen(false);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Delete this report and its file?', {
      title: 'Delete Report',
      confirmLabel: 'Delete',
    });
    if (!confirmed) return;
    try {
      await deleteReport(id);
      await fetchReports();
      await showAlert('Report deleted.', 'Success');
    } catch (err) {
      console.error('Failed to delete report', err);
      await showAlert('Failed to delete report.');
    }
  };

  const columns = [
    { key: 'reportName', label: 'Report Name' },
    { key: 'reportType', label: 'Report Type' },
    {
      key: 'patientId',
      label: 'Patient',
      render: (row) => (
        <span className="text-teal-400">
          {patientMap[row.patientId] || `ID ${row.patientId}`}
        </span>
      ),
    },
    { key: 'uploadDate', label: 'Upload Date' },
    {
      key: 'notes',
      label: 'Notes',
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.notes}>
          {row.notes || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleView(row)}
            className="btn-secondary py-1 text-xs"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => handleDownload(row)}
            className="btn-secondary py-1 text-xs"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="btn-secondary py-1 text-xs"
          >
            Edit
          </button>
          <button type="button" onClick={() => handleDelete(row.id)} className="btn-danger">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">Medical Reports</h2>
          <p className="mt-1 text-sm text-slate-400">
            Upload and manage PDF, JPG, and PNG reports
          </p>
        </div>
        <button type="button" onClick={openUpload} className="btn-primary">
          + Upload Report
        </button>
      </div>

      <div className="card flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="patientFilter" className="mb-1.5 block text-sm font-medium text-slate-300">
            Filter by Patient
          </label>
          <select
            id="patientFilter"
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="input-field max-w-md"
          >
            <option value="">All Patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.patientCode})
              </option>
            ))}
          </select>
        </div>
        {patientFilter && (
          <button
            type="button"
            onClick={() => setPatientFilter('')}
            className="btn-secondary"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <DataTable
          columns={columns}
          data={reports}
          loading={loading}
          emptyMessage={
            patientFilter
              ? 'No reports found for this patient.'
              : 'No reports uploaded yet.'
          }
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingReport ? 'Edit Report' : 'Upload Report'}
      >
        <ReportUploadForm
          patients={patients}
          initialValues={
            editingReport
              ? {
                  patientId: editingReport.patientId,
                  reportType: editingReport.reportType,
                  notes: editingReport.notes,
                }
              : {}
          }
          requireFile={!editingReport}
          submitLabel={editingReport ? 'Update Report' : 'Upload Report'}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        title={viewReport ? `View: ${viewReport.reportName}` : 'View Report'}
      >
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
              <iframe src={viewUrl} title="Report preview" className="h-96 w-full rounded-lg border border-slate-700" />
            ) : (
              <img src={viewUrl} alt={viewReport.reportName} className="max-h-96 w-full rounded-lg object-contain" />
            )}
            <div className="flex justify-end gap-3 border-t border-slate-700/60 pt-4">
              <button type="button" onClick={() => handleDownload(viewReport)} className="btn-primary">
                Download
              </button>
              <button type="button" onClick={closeViewModal} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
