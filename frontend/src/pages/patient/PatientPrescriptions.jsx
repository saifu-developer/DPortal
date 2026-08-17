import { useEffect, useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/layout/Modal';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';
import {
  getPrescriptionsByPatient,
  getPrescriptionById,
  downloadPrescriptionPdf,
} from '../../services/prescriptionService';
import { downloadPrescriptionPdfFile, printPrescriptionPdf } from '../../utils/prescriptionUtils';

export default function PatientPrescriptions() {
  const { auth } = useAuth();
  const { showAlert } = useDialog();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRx, setViewRx] = useState(null);

  useEffect(() => {
    if (!auth?.patientId) return;
    getPrescriptionsByPatient(auth.patientId)
      .then((res) => setPrescriptions(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth?.patientId]);

  const openView = async (id) => {
    try {
      const res = await getPrescriptionById(id);
      setViewRx(res.data);
    } catch {
      await showAlert('Failed to load prescription.');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await downloadPrescriptionPdfFile(downloadPrescriptionPdf, id);
    } catch {
      await showAlert('Failed to download PDF.');
    }
  };

  const handlePrint = async (id) => {
    try {
      await printPrescriptionPdf(downloadPrescriptionPdf, id);
    } catch (err) {
      await showAlert(err.message || 'Failed to print prescription.');
    }
  };

  const columns = [
    { key: 'diagnosis', label: 'Diagnosis' },
    {
      key: 'medicines',
      label: 'Medicines',
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.medicines}>
          {row.medicines}
        </span>
      ),
    },
    { key: 'prescribedDate', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openView(row.id)} className="btn-secondary py-1 text-xs">
            View
          </button>
          <button type="button" onClick={() => handleDownloadPdf(row.id)} className="btn-secondary py-1 text-xs">
            PDF
          </button>
          <button type="button" onClick={() => handlePrint(row.id)} className="btn-secondary py-1 text-xs">
            Print
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">My Prescriptions</h2>
        <p className="mt-1 text-sm text-slate-400">View, download, and print your prescriptions</p>
      </div>
      <div className="card overflow-hidden p-0">
        <DataTable
          columns={columns}
          data={prescriptions}
          loading={loading}
          emptyMessage="No prescriptions found."
        />
      </div>

      <Modal isOpen={!!viewRx} onClose={() => setViewRx(null)} title="Prescription Details">
        {viewRx && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-slate-500">Diagnosis:</span>{' '}
              <span className="text-white">{viewRx.diagnosis}</span>
            </p>
            <p>
              <span className="text-slate-500">Medicines:</span>{' '}
              <span className="whitespace-pre-wrap text-white">{viewRx.medicines}</span>
            </p>
            <p>
              <span className="text-slate-500">Instructions:</span>{' '}
              <span className="whitespace-pre-wrap text-white">{viewRx.instructions}</span>
            </p>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-700/60 pt-4">
              <button type="button" onClick={() => handleDownloadPdf(viewRx.id)} className="btn-primary">
                Download PDF
              </button>
              <button type="button" onClick={() => handlePrint(viewRx.id)} className="btn-secondary">
                Print
              </button>
              <button type="button" onClick={() => setViewRx(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
