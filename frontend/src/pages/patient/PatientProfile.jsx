import { useEffect, useState } from 'react';
import ReusableForm from '../../components/forms/ReusableForm';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';
import { getPatientById, updatePatient } from '../../services/patientService';

const formFields = [
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

export default function PatientProfile() {
  const { auth } = useAuth();
  const { showAlert } = useDialog();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!auth?.patientId) return;
    getPatientById(auth.patientId)
      .then((res) => {
        const p = res.data;
        setForm({
          fullName: p.fullName || '',
          mobile: p.mobile || '',
          email: p.email || '',
          age: p.age ?? '',
          gender: p.gender || '',
          address: p.address || '',
          medicalNotes: p.medicalNotes || '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth?.patientId]);

  const handleSubmit = async () => {
    try {
      const res = await getPatientById(auth.patientId);
      await updatePatient(auth.patientId, {
        ...res.data,
        ...form,
        age: Number(form.age),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await showAlert('Profile updated successfully.', 'Success');
    } catch {
      await showAlert('Failed to update profile.');
    }
  };

  if (loading) return <p className="text-slate-400">Loading profile...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">My Profile</h2>
        <p className="mt-1 text-sm text-slate-400">Update your personal details</p>
      </div>
      {saved && (
        <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
          Profile updated successfully.
        </p>
      )}
      <div className="card max-w-3xl">
        <ReusableForm
          fields={formFields}
          values={form}
          onChange={(name, value) => setForm((prev) => ({ ...prev, [name]: value }))}
          onSubmit={handleSubmit}
          submitLabel="Save Profile"
        />
      </div>
    </div>
  );
}
