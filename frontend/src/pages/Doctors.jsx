import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/tables/DataTable';
import ReusableForm from '../components/forms/ReusableForm';
import Modal from '../components/layout/Modal';
import { useDialog } from '../context/DialogContext';
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../services/doctorService';

const emptyForm = {
  doctorCode: '',
  fullName: '',
  specialization: '',
  mobile: '',
  email: '',
  experience: '',
};

const formFields = [
  { name: 'doctorCode', label: 'Doctor Code', required: true },
  { name: 'fullName', label: 'Full Name', required: true },
  { name: 'specialization', label: 'Specialization', required: true },
  { name: 'mobile', label: 'Mobile', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'experience', label: 'Experience (years)', type: 'number', required: true },
];

export default function Doctors() {
  const { showAlert, showConfirm } = useDialog();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getDoctors();
      setDoctors(res.data || []);
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return doctors;
    return doctors.filter(
      (d) =>
        d.fullName?.toLowerCase().includes(q) ||
        d.doctorCode?.toLowerCase().includes(q) ||
        d.specialization?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q)
    );
  }, [doctors, search]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingId(doctor.id);
    setForm({
      doctorCode: doctor.doctorCode || '',
      fullName: doctor.fullName || '',
      specialization: doctor.specialization || '',
      mobile: doctor.mobile || '',
      email: doctor.email || '',
      experience: doctor.experience ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, experience: Number(form.experience) };
      if (editingId) {
        await updateDoctor(editingId, payload);
        setModalOpen(false);
        await fetchDoctors();
        await showAlert('Doctor updated successfully.', 'Success');
      } else {
        await createDoctor(payload);
        setModalOpen(false);
        await fetchDoctors();
        await showAlert('Doctor created successfully.', 'Success');
      }
    } catch (err) {
      console.error('Failed to save doctor', err);
      await showAlert('Failed to save doctor. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Delete this doctor?', {
      title: 'Delete Doctor',
      confirmLabel: 'Delete',
    });
    if (!confirmed) return;
    try {
      await deleteDoctor(id);
      await fetchDoctors();
      await showAlert('Doctor deleted.', 'Success');
    } catch (err) {
      console.error('Failed to delete doctor', err);
      await showAlert('Failed to delete doctor.');
    }
  };

  const columns = [
    { key: 'doctorCode', label: 'Code' },
    { key: 'fullName', label: 'Name' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'experience', label: 'Exp (yrs)' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
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
          <h2 className="text-xl font-bold text-white sm:text-2xl">Doctor Management</h2>
          <p className="mt-1 text-sm text-slate-400">Manage doctor profiles</p>
        </div>
        <button type="button" onClick={openAdd} className="btn-primary">
          + Add Doctor
        </button>
      </div>

      <div className="card">
        <input
          type="search"
          placeholder="Search by name, code, specialization, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      <div className="card overflow-hidden p-0">
        <DataTable columns={columns} data={filtered} loading={loading} />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Doctor' : 'Add Doctor'}
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
