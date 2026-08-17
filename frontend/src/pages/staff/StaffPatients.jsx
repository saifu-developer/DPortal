import { useEffect, useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/layout/Modal';
import PatientProfileModal from '../../components/PatientProfileModal';
import { useDialog } from '../../context/DialogContext';
import {
  getPatients,
  searchPatientByCode,
  searchPatientByMobile,
} from '../../services/patientService';

export default function StaffPatients() {
  const { showAlert } = useDialog();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    getPatients()
      .then((res) => setPatients(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearchByCode = async () => {
    if (!searchCode.trim()) return;
    try {
      const res = await searchPatientByCode(searchCode.trim());
      setProfileId(res.data.id);
    } catch {
      await showAlert('Patient not found.');
    }
  };

  const handleSearchByMobile = async () => {
    if (!searchMobile.trim()) return;
    try {
      const res = await searchPatientByMobile(searchMobile.trim());
      setProfileId(res.data.id);
    } catch {
      await showAlert('Patient not found.');
    }
  };

  const columns = [
    { key: 'patientCode', label: 'Code' },
    { key: 'fullName', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'age', label: 'Age' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button type="button" onClick={() => setProfileId(row.id)} className="btn-secondary py-1 text-xs">
          View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">Patient Search</h2>
        <p className="mt-1 text-sm text-slate-400">Search and view patient records (read-only)</p>
      </div>

      <div className="card flex flex-col gap-4 sm:flex-row sm:items-end">
        <div>
          <label className="mb-1.5 block text-sm text-slate-400">By Patient Code</label>
          <div className="flex gap-2">
            <input
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="input-field max-w-xs"
            />
            <button type="button" onClick={handleSearchByCode} className="btn-secondary">
              Search
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-400">By Mobile</label>
          <div className="flex gap-2">
            <input
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="input-field max-w-xs"
            />
            <button type="button" onClick={handleSearchByMobile} className="btn-secondary">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <DataTable columns={columns} data={patients} loading={loading} />
      </div>

      <Modal isOpen={!!profileId} onClose={() => setProfileId(null)} title="Patient Medical Record" size="lg">
        <PatientProfileModal patientId={profileId} onClose={() => setProfileId(null)} />
      </Modal>
    </div>
  );
}
