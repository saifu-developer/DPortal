import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/tables/DataTable';
import ReusableForm from '../components/forms/ReusableForm';
import Modal from '../components/layout/Modal';
import { useDialog } from '../context/DialogContext';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../services/appointmentService';
import { getPatients } from '../services/patientService';
import { getDoctors } from '../services/doctorService';
import {
  APPOINTMENT_STATUSES,
  canPrescribe,
  normalizeStatus,
  statusBadgeClass,
} from '../utils/appointmentStatus';

const emptyForm = {
  patientId: '',
  doctorId: '',
  appointmentDate: '',
  appointmentTime: '',
  symptoms: '',
  status: 'SCHEDULED',
};

export default function Appointments() {
  const { showAlert, showConfirm } = useDialog();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((p) => [p.id, p.fullName])),
    [patients]
  );
  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((d) => [d.id, d.fullName])),
    [doctors]
  );

  const formFields = [
    {
      name: 'patientId',
      label: 'Patient',
      type: 'select',
      required: true,
      options: patients.map((p) => ({ value: p.id, label: `${p.fullName} (${p.patientCode})` })),
    },
    {
      name: 'doctorId',
      label: 'Doctor',
      type: 'select',
      required: true,
      options: doctors.map((d) => ({ value: d.id, label: `${d.fullName} (${d.specialization})` })),
    },
    { name: 'appointmentDate', label: 'Date', type: 'date', required: true },
    { name: 'appointmentTime', label: 'Time', type: 'time', required: true },
    { name: 'symptoms', label: 'Symptoms / Reason', fullWidth: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: APPOINTMENT_STATUSES.map((s) => ({ value: s, label: s })),
    },
  ];

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        getAppointments(),
        getPatients(),
        getDoctors(),
      ]);
      setAppointments(appointmentsRes.data || []);
      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (appointment) => {
    setEditingId(appointment.id);
    setForm({
      patientId: appointment.patientId ?? '',
      doctorId: appointment.doctorId ?? '',
      appointmentDate: appointment.appointmentDate || '',
      appointmentTime: appointment.appointmentTime?.slice(0, 5) || '',
      symptoms: appointment.symptoms || '',
      status: normalizeStatus(appointment.status),
    });
    setModalOpen(true);
  };

  const handlePrescribe = (appointment) => {
    navigate('/prescriptions', {
      state: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        status: normalizeStatus(form.status),
      };
      if (editingId) {
        await updateAppointment(editingId, payload);
        setModalOpen(false);
        await fetchAll();
        await showAlert('Appointment updated successfully.', 'Success');
      } else {
        await createAppointment(payload);
        setModalOpen(false);
        await fetchAll();
        await showAlert('Appointment created successfully.', 'Success');
      }
    } catch (err) {
      console.error('Failed to save appointment', err);
      await showAlert('Failed to save appointment. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Delete this appointment?', {
      title: 'Delete Appointment',
      confirmLabel: 'Delete',
    });
    if (!confirmed) return;
    try {
      await deleteAppointment(id);
      await fetchAll();
      await showAlert('Appointment deleted.', 'Success');
    } catch (err) {
      console.error('Failed to delete appointment', err);
      await showAlert('Failed to delete appointment.');
    }
  };

  const columns = [
    { key: 'appointmentDate', label: 'Date' },
    {
      key: 'appointmentTime',
      label: 'Time',
      render: (row) => row.appointmentTime?.slice(0, 5) || '—',
    },
    {
      key: 'patientId',
      label: 'Patient',
      render: (row) => (
        <span className="text-teal-400">{patientMap[row.patientId] || `ID ${row.patientId}`}</span>
      ),
    },
    {
      key: 'doctorId',
      label: 'Doctor',
      render: (row) => (
        <span className="text-blue-400">{doctorMap[row.doctorId] || `ID ${row.doctorId}`}</span>
      ),
    },
    {
      key: 'symptoms',
      label: 'Symptoms',
      render: (row) => (
        <span className="block max-w-[180px] truncate" title={row.symptoms}>
          {row.symptoms || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>
          {normalizeStatus(row.status)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {canPrescribe(row.status) && (
            <button
              type="button"
              onClick={() => handlePrescribe(row)}
              className="btn-primary py-1 text-xs"
            >
              Prescribe
            </button>
          )}
          <button type="button" onClick={() => openEdit(row)} className="btn-secondary py-1 text-xs">
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
          <h2 className="text-xl font-bold text-white sm:text-2xl">Appointments</h2>
          <p className="mt-1 text-sm text-slate-400">
            Schedule visits. Creating a prescription automatically marks the appointment completed.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn-primary">
          + Add Appointment
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <DataTable columns={columns} data={appointments} loading={loading} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Appointment' : 'Add Appointment'}
      >
        <ReusableForm
          fields={formFields}
          values={form}
          onChange={(name, value) => setForm((prev) => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitLabel={editingId ? 'Update' : 'Create'}
        />
      </Modal>
    </div>
  );
}
