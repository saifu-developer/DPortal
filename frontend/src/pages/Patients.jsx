import { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/tables/DataTable';
import ReusableForm from '../components/forms/ReusableForm';
import Modal from '../components/layout/Modal';
import PatientProfileModal from '../components/PatientProfileModal';
import PageHeader from '../components/ui/PageHeader';
import FilterBar, { FilterField } from '../components/ui/FilterBar';
import ActionMenu from '../components/ui/ActionMenu';
import { useDialog } from '../context/DialogContext';
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatientByCode,
  searchPatientByMobile,
} from '../services/patientService';

const emptyForm = {
  patientCode: '',
  fullName: '',
  mobile: '',
  email: '',
  age: '',
  gender: '',
  address: '',
  medicalNotes: '',
};

const formFields = [
  { name: 'patientCode', label: 'Patient Code', required: true },
  { name: 'fullName', label: 'Full Name', required: true },
  { name: 'mobile', label: 'Mobile', required: true },
  { name: 'email', label: 'Email Address', type: 'email' },
  { name: 'age', label: 'Age', type: 'number', required: true },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { name: 'address', label: 'Address', fullWidth: true },
  { name: 'medicalNotes', label: 'Medical Notes', type: 'textarea', fullWidth: true },
];

export default function Patients() {
  const { showAlert, showConfirm } = useDialog();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePatientId, setProfilePatientId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getPatients();
      setPatients(res.data || []);
    } catch (err) {
      console.error('Failed to load patients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = useMemo(() => {
    let result = [...patients];
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(q) ||
          p.patientCode?.toLowerCase().includes(q) ||
          p.mobile?.includes(q)
      );
    }
    result.sort((a, b) => {
      if (sortOrder === 'name-desc') return (b.fullName || '').localeCompare(a.fullName || '');
      return (a.fullName || '').localeCompare(b.fullName || '');
    });
    return result;
  }, [patients, search, sortOrder]);

  const hasActiveFilters = search || sortOrder !== 'name-asc';

  const resetFilters = () => {
    setSearch('');
    setSortOrder('name-asc');
  };

  const handleSearchByCode = async () => {
    if (!searchCode.trim()) return;
    try {
      const res = await searchPatientByCode(searchCode.trim());
      setProfilePatientId(res.data.id);
      setProfileOpen(true);
    } catch {
      await showAlert('No patient found with that ID/code.');
    }
  };

  const handleSearchByMobile = async () => {
    if (!searchMobile.trim()) return;
    try {
      const res = await searchPatientByMobile(searchMobile.trim());
      setProfilePatientId(res.data.id);
      setProfileOpen(true);
    } catch {
      await showAlert('No patient found with that mobile number.');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (patient) => {
    setEditingId(patient.id);
    setForm({
      patientCode: patient.patientCode || '',
      fullName: patient.fullName || '',
      mobile: patient.mobile || '',
      email: patient.email || '',
      age: patient.age ?? '',
      gender: patient.gender || '',
      address: patient.address || '',
      medicalNotes: patient.medicalNotes || '',
    });
    setModalOpen(true);
  };

  const openProfile = (patient) => {
    setProfilePatientId(patient.id);
    setProfileOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, age: Number(form.age) };
      if (editingId) {
        await updatePatient(editingId, payload);
        setModalOpen(false);
        await fetchPatients();
        await showAlert('Patient updated successfully.', 'Success');
      } else {
        await createPatient(payload);
        setModalOpen(false);
        await fetchPatients();
        await showAlert('Patient created successfully.', 'Success');
      }
    } catch (err) {
      console.error('Failed to save patient', err);
      await showAlert('Failed to save patient. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Delete this patient?', {
      title: 'Delete Patient',
      confirmLabel: 'Delete',
    });
    if (!confirmed) return;
    try {
      await deletePatient(id);
      await fetchPatients();
      await showAlert('Patient deleted.', 'Success');
    } catch (err) {
      console.error('Failed to delete patient', err);
      await showAlert('Failed to delete patient.');
    }
  };

  const columns = [
    { key: 'patientCode', label: 'Code' },
    {
      key: 'fullName',
      label: 'Name',
      render: (row) => <span className="font-medium text-slate-200">{row.fullName}</span>,
    },
    { key: 'mobile', label: 'Mobile' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionMenu
          items={[
            { label: 'Profile', onClick: () => openProfile(row) },
            { label: 'Edit', onClick: () => openEdit(row) },
            { label: 'Delete', onClick: () => handleDelete(row.id), variant: 'danger' },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        title="Patients"
        subtitle="Search and manage complete patient medical records."
        action={
          <button type="button" onClick={openAdd} className="btn-primary">
            + Add Patient
          </button>
        }
      />

      <FilterBar onReset={resetFilters} showReset={hasActiveFilters}>
        <FilterField label="Search" className="lg:col-span-5">
          <input
            type="search"
            placeholder="Search by name, code, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </FilterField>
        <FilterField label="Sort" className="lg:col-span-3">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field">
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
          </select>
        </FilterField>
        <FilterField label="Search by Patient ID / Code" className="lg:col-span-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Patient code"
              className="input-field"
            />
            <button type="button" onClick={handleSearchByCode} className="btn-secondary shrink-0">
              Search
            </button>
          </div>
        </FilterField>
        <FilterField label="Search by Mobile Number" className="lg:col-span-4">
          <div className="flex gap-2">
            <input
              type="tel"
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              placeholder="Mobile number"
              className="input-field"
            />
            <button type="button" onClick={handleSearchByMobile} className="btn-secondary shrink-0">
              Search
            </button>
          </div>
        </FilterField>
      </FilterBar>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No patients found"
        emptyIcon="patients"
        emptyAction={
          !hasActiveFilters ? (
            <button type="button" onClick={openAdd} className="btn-primary">
              + Add Patient
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
        title={editingId ? 'Edit Patient' : 'Add Patient'}
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

      <Modal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Patient Medical Record"
        size="lg"
      >
        <PatientProfileModal patientId={profilePatientId} onClose={() => setProfileOpen(false)} />
      </Modal>
    </div>
  );
}
