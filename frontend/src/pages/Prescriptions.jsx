import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from '../components/tables/DataTable';
import ReusableForm from '../components/forms/ReusableForm';
import Modal from '../components/layout/Modal';
import PageHeader from '../components/ui/PageHeader';
import FilterBar, { FilterField } from '../components/ui/FilterBar';
import ActionMenu from '../components/ui/ActionMenu';
import StatusBadge from '../components/ui/StatusBadge';
import { useDialog } from '../context/DialogContext';
import {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionById,
  downloadPrescriptionPdf,
} from '../services/prescriptionService';
import { getPatients } from '../services/patientService';
import { getAppointments } from '../services/appointmentService';
import { downloadPrescriptionPdfFile, printPrescriptionPdf } from '../utils/prescriptionUtils';
import { canPrescribe, isCompleted, normalizeStatus } from '../utils/appointmentStatus';

const emptyForm = {
  patientId: '',
  appointmentId: '',
  diagnosis: '',
  medicines: '',
  dosage: '',
  notes: '',
  prescribedDate: '',
};

export default function Prescriptions() {
  const { showAlert, showConfirm } = useDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPrescription, setViewPrescription] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [searchPatient, setSearchPatient] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDiagnosis, setFilterDiagnosis] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p.fullName])),
    [patients]
  );

  const appointmentStatusMap = useMemo(
    () => Object.fromEntries(appointments.map((a) => [a.id, a.status])),
    [appointments]
  );

  const prescribedAppointmentIds = useMemo(
    () => new Set(prescriptions.map((p) => p.appointmentId).filter(Boolean)),
    [prescriptions]
  );

  const eligibleAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (!canPrescribe(a.status) || isCompleted(a.status)) return false;
      if (editingId) {
        const current = prescriptions.find((p) => p.id === editingId);
        if (current?.appointmentId === a.id) return true;
      }
      return !prescribedAppointmentIds.has(a.id);
    });
  }, [appointments, prescribedAppointmentIds, editingId, prescriptions]);

  const appointmentOptions = useMemo(() => {
    const options = eligibleAppointments.map((a) => ({
      value: a.id,
      label: `#${a.id} — ${patientMap[a.patientId] || 'Patient'} — ${a.appointmentDate} ${a.appointmentTime?.slice(0, 5) || ''} (${normalizeStatus(a.status)})`,
    }));
    if (editingId && form.appointmentId) {
      const exists = options.some((o) => String(o.value) === String(form.appointmentId));
      if (!exists) {
        const a = appointments.find((x) => x.id === Number(form.appointmentId));
        if (a) {
          options.unshift({
            value: a.id,
            label: `#${a.id} — ${patientMap[a.patientId] || 'Patient'} — ${a.appointmentDate} (linked)`,
          });
        }
      }
    }
    return options;
  }, [eligibleAppointments, editingId, form.appointmentId, appointments, patientMap]);

  const formFields = [
    {
      name: 'appointmentId',
      label: 'Appointment',
      type: 'select',
      required: true,
      options: appointmentOptions,
      disabled: !!editingId,
    },
    {
      name: 'patientId',
      label: 'Patient',
      type: 'select',
      required: true,
      options: patients.map((p) => ({ value: p.id, label: `${p.fullName} (${p.patientCode})` })),
      disabled: true,
    },
    { name: 'diagnosis', label: 'Diagnosis', required: true, fullWidth: true },
    { name: 'medicines', label: 'Medicines', type: 'textarea', required: true, fullWidth: true },
    { name: 'dosage', label: 'Dosage', type: 'textarea', required: true, fullWidth: true },
    { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
    { name: 'prescribedDate', label: 'Prescribed Date', type: 'date', required: true },
  ];

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prescriptionsRes, patientsRes, appointmentsRes] = await Promise.all([
        getPrescriptions(),
        getPatients(),
        getAppointments(),
      ]);
      setPrescriptions(prescriptionsRes.data || []);
      setPatients(patientsRes.data || []);
      setAppointments(appointmentsRes.data || []);
    } catch (err) {
      console.error('Failed to load prescriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const state = location.state;
    if (!state?.appointmentId) return;

    setEditingId(null);
    setForm({
      ...emptyForm,
      appointmentId: state.appointmentId,
      patientId: state.patientId || '',
      prescribedDate: new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const filteredPrescriptions = useMemo(() => {
    let result = [...prescriptions];

    if (searchPatient.trim()) {
      const q = searchPatient.toLowerCase().trim();
      result = result.filter((p) => {
        const name = patientMap[p.patientId]?.toLowerCase() || '';
        return name.includes(q) || String(p.patientId).includes(q);
      });
    }

    if (filterDate) {
      result = result.filter((p) => p.prescribedDate === filterDate);
    }

    if (filterDiagnosis.trim()) {
      const q = filterDiagnosis.toLowerCase().trim();
      result = result.filter((p) => p.diagnosis?.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      const dateA = a.prescribedDate || '';
      const dateB = b.prescribedDate || '';
      return sortOrder === 'newest' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
    });

    return result;
  }, [prescriptions, searchPatient, filterDate, filterDiagnosis, sortOrder, patientMap]);

  const hasActiveFilters = searchPatient || filterDate || filterDiagnosis || sortOrder !== 'newest';

  const resetFilters = () => {
    setSearchPatient('');
    setFilterDate('');
    setFilterDiagnosis('');
    setSortOrder('newest');
  };

  const parseInstructions = (instructions) => {
    if (!instructions) return { dosage: '', notes: '' };
    const parts = instructions.split('\n\nNotes: ');
    if (parts.length === 2) return { dosage: parts[0], notes: parts[1] };
    return { dosage: instructions, notes: '' };
  };

  const buildInstructions = (dosage, notes) => {
    if (notes) return `${dosage}\n\nNotes: ${notes}`;
    return dosage;
  };

  const handleFormChange = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'appointmentId') {
        const appointment = appointments.find((a) => a.id === Number(value));
        if (appointment) {
          next.patientId = appointment.patientId ?? '';
        }
      }
      return next;
    });
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, prescribedDate: new Date().toISOString().split('T')[0] });
    setModalOpen(true);
  };

  const openEdit = (prescription) => {
    const { dosage, notes } = parseInstructions(prescription.instructions);
    setEditingId(prescription.id);
    setForm({
      patientId: prescription.patientId ?? '',
      appointmentId: prescription.appointmentId ?? '',
      diagnosis: prescription.diagnosis || '',
      medicines: prescription.medicines || '',
      dosage,
      notes,
      prescribedDate: prescription.prescribedDate || '',
    });
    setModalOpen(true);
  };

  const openView = async (id) => {
    try {
      const res = await getPrescriptionById(id);
      setViewPrescription(res.data);
      setViewModalOpen(true);
    } catch (err) {
      console.error('Failed to load prescription', err);
      await showAlert('Failed to load prescription.');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      await downloadPrescriptionPdfFile(downloadPrescriptionPdf, id);
    } catch (err) {
      console.error('Failed to download PDF', err);
      await showAlert('Failed to download prescription PDF.');
    }
  };

  const handlePrint = async (id) => {
    try {
      await printPrescriptionPdf(downloadPrescriptionPdf, id);
    } catch (err) {
      console.error('Failed to print PDF', err);
      await showAlert(err.message || 'Failed to print prescription.');
    }
  };

  const handleSubmit = async () => {
    if (!form.appointmentId) {
      await showAlert('Please select an appointment. Prescriptions must be linked to an appointment.');
      return;
    }
    try {
      const payload = {
        patientId: Number(form.patientId),
        appointmentId: Number(form.appointmentId),
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        instructions: buildInstructions(form.dosage, form.notes),
        prescribedDate: form.prescribedDate,
      };
      if (editingId) {
        await updatePrescription(editingId, payload);
        setModalOpen(false);
        await fetchAll();
        await showAlert('Prescription updated successfully.', 'Success');
      } else {
        await createPrescription(payload);
        setModalOpen(false);
        await fetchAll();
        await showAlert(
          'Prescription saved. The appointment has been marked COMPLETED and linked to the patient.',
          'Success'
        );
      }
    } catch (err) {
      console.error('Failed to save prescription', err);
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to save prescription. Please try again.';
      await showAlert(typeof message === 'string' ? message : 'Failed to save prescription.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Delete this prescription?', {
      title: 'Delete Prescription',
      confirmLabel: 'Delete',
    });
    if (!confirmed) return;
    try {
      await deletePrescription(id);
      await fetchAll();
      await showAlert('Prescription deleted.', 'Success');
    } catch (err) {
      console.error('Failed to delete prescription', err);
      await showAlert('Failed to delete prescription.');
    }
  };

  const getPrescriptionStatus = (row) => {
    const apptStatus = appointmentStatusMap[row.appointmentId];
    return apptStatus || 'COMPLETED';
  };

  const columns = [
    {
      key: 'patientId',
      label: 'Patient',
      render: (row) => (
        <span className="font-medium text-slate-200">{patientMap[row.patientId] || `ID ${row.patientId}`}</span>
      ),
    },
    {
      key: 'appointmentId',
      label: 'Appointment',
      render: (row) => (row.appointmentId ? `#${row.appointmentId}` : '—'),
    },
    {
      key: 'diagnosis',
      label: 'Diagnosis',
      render: (row) => (
        <span className="block max-w-[200px] truncate" title={row.diagnosis}>
          {row.diagnosis}
        </span>
      ),
    },
    {
      key: 'medicines',
      label: 'Medicine',
      render: (row) => (
        <span className="block max-w-[180px] truncate" title={row.medicines}>
          {row.medicines}
        </span>
      ),
    },
    { key: 'prescribedDate', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={getPrescriptionStatus(row)} type="prescription" />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionMenu
          items={[
            { label: 'View', onClick: () => openView(row.id) },
            { label: 'Edit', onClick: () => openEdit(row) },
            { label: 'Download PDF', onClick: () => handleDownloadPdf(row.id) },
            { label: 'Print', onClick: () => handlePrint(row.id) },
            { label: 'Delete', onClick: () => handleDelete(row.id), variant: 'danger' },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        title="Prescriptions"
        subtitle="Manage patient prescriptions and treatment records."
        action={
          <button type="button" onClick={openAdd} className="btn-primary">
            + Create Prescription
          </button>
        }
      />

      <FilterBar onReset={resetFilters} showReset={hasActiveFilters}>
        <FilterField label="Search Patient" className="lg:col-span-4">
          <input
            type="search"
            placeholder="Search by patient name..."
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="input-field"
          />
        </FilterField>
        <FilterField label="Filter by Date" className="lg:col-span-3">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="input-field"
          />
        </FilterField>
        <FilterField label="Filter by Diagnosis" className="lg:col-span-3">
          <input
            type="search"
            placeholder="Search diagnosis..."
            value={filterDiagnosis}
            onChange={(e) => setFilterDiagnosis(e.target.value)}
            className="input-field"
          />
        </FilterField>
        <FilterField label="Sort" className="lg:col-span-2">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </FilterField>
      </FilterBar>

      <DataTable
        columns={columns}
        data={filteredPrescriptions}
        loading={loading}
        emptyMessage="No prescriptions found"
        emptyIcon="prescriptions"
        emptyAction={
          !hasActiveFilters ? (
            <button type="button" onClick={openAdd} className="btn-primary">
              + Create Prescription
            </button>
          ) : (
            <button type="button" onClick={resetFilters} className="btn-secondary">
              Reset Filters
            </button>
          )
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Prescription' : 'Create Prescription'}
      >
        <ReusableForm
          fields={formFields}
          values={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitLabel={editingId ? 'Update' : 'Save Prescription'}
        />
      </Modal>

      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Prescription Details"
      >
        {viewPrescription && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="form-label mb-1">Patient</p>
                <p className="text-[15px] text-slate-200">{patientMap[viewPrescription.patientId] || '—'}</p>
              </div>
              <div>
                <p className="form-label mb-1">Appointment</p>
                <p className="text-[15px] text-slate-200">
                  {viewPrescription.appointmentId ? `#${viewPrescription.appointmentId}` : '—'}
                </p>
              </div>
              <div>
                <p className="form-label mb-1">Date</p>
                <p className="text-[15px] text-slate-200">{viewPrescription.prescribedDate}</p>
              </div>
              <div>
                <p className="form-label mb-1">Status</p>
                <StatusBadge status={getPrescriptionStatus(viewPrescription)} type="prescription" />
              </div>
              <div className="sm:col-span-2">
                <p className="form-label mb-1">Diagnosis</p>
                <p className="text-[15px] text-slate-200">{viewPrescription.diagnosis}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="form-label mb-1">Medicines</p>
                <p className="whitespace-pre-wrap text-[15px] text-slate-200">{viewPrescription.medicines}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="form-label mb-1">Dosage & Instructions</p>
                <p className="whitespace-pre-wrap text-[15px] text-slate-200">{viewPrescription.instructions}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-700/60 pt-6">
              <button type="button" onClick={() => handleDownloadPdf(viewPrescription.id)} className="btn-primary">
                Download PDF
              </button>
              <button type="button" onClick={() => handlePrint(viewPrescription.id)} className="btn-secondary">
                Print
              </button>
              <button type="button" onClick={() => setViewModalOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
