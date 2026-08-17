import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/layout/Modal';
import { useDialog } from '../../context/DialogContext';
import {
  getPrescriptions,
  getPrescriptionById,
  downloadPrescriptionPdf,
} from '../../services/prescriptionService';
import { getPatients } from '../../services/patientService';
import { downloadPrescriptionPdfFile, printPrescriptionPdf } from '../../utils/prescriptionUtils';

export default function StaffPrescriptions() {
  const { showAlert } = useDialog();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRx, setViewRx] = useState(null);

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p.fullName])),
    [patients]
  );

  useEffect(() => {
    Promise.all([getPrescriptions(), getPatients()])
      .then(([rx, p]) => {
        setPrescriptions(rx.data || []);
        setPatients(p.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openView = async (id) => {
    try {
      const res = await getPrescriptionById(id);
      setViewRx(res.data);
    } catch {
      await showAlert('Failed to load prescription.');
    }
  };

  const handleDownload = async (id) => {
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
    {
      key: 'patientId',
      label: 'Patient',
      render: (row) => patientMap[row.patientId] || row.patientId,
    },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'prescribedDate', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openView(row.id)} className="btn-secondary py-1 text-xs">
            View
          </button>
          <button type="button" onClick={() => handleDownload(row.id)} className="btn-secondary py-1 text-xs">
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
        <h2 className="text-xl font-bold text-white sm:text-2xl">Prescriptions</h2>
        <p className="mt-1 text-sm text-slate-400">View, download, and print only — no create/edit/delete</p>
      </div>
      <div className="card overflow-hidden p-0">
        <DataTable columns={columns} data={prescriptions} loading={loading} />
      </div>
      <Modal isOpen={!!viewRx} onClose={() => setViewRx(null)} title="Prescription">
        {viewRx && (
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Patient:</span>{' '}
              {patientMap[viewRx.patientId] || viewRx.patientId}
            </p>
            <p>
              <span className="text-slate-500">Diagnosis:</span> {viewRx.diagnosis}
            </p>
            <p>
              <span className="text-slate-500">Medicines:</span>{' '}
              <span className="whitespace-pre-wrap">{viewRx.medicines}</span>
            </p>
            <p>
              <span className="text-slate-500">Instructions:</span>{' '}
              <span className="whitespace-pre-wrap">{viewRx.instructions}</span>
            </p>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-700/60 pt-4">
              <button type="button" onClick={() => handleDownload(viewRx.id)} className="btn-primary">
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
