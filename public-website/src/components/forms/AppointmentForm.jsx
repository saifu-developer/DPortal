import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  getSlotAvailability,
  submitAppointmentRequest,
} from '../../services/appointmentRequestService';
import { ALL_TIME_SLOTS } from '../../constants/appointmentSlots';
import {
  AnimatedButton,
  AnimatedInput,
  AnimatedSelect,
  AnimatedTextarea,
  FormSkeleton,
} from '../motion';

const emptyForm = {
  patientName: '',
  mobileNumber: '',
  email: '',
  age: '',
  gender: '',
  reasonForVisit: '',
  preferredDate: '',
  preferredTimeSlot: '',
};

const isSunday = (dateString) => {
  if (!dateString) return false;
  return new Date(`${dateString}T00:00:00`).getDay() === 0;
};

export default function AppointmentForm({ onSuccess }) {
  const formRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!form.preferredDate || isSunday(form.preferredDate)) {
      setBookedSlots([]);
      return undefined;
    }

    let cancelled = false;
    setSlotsLoading(true);

    getSlotAvailability(form.preferredDate)
      .then((response) => {
        if (cancelled) return;
        const booked = response.data.bookedSlots || [];
        setBookedSlots(booked);
        setForm((prev) => {
          if (prev.preferredTimeSlot && booked.includes(prev.preferredTimeSlot)) {
            return { ...prev, preferredTimeSlot: '' };
          }
          return prev;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setBookedSlots([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [form.preferredDate]);

  const renderTimeSlotOption = (slot) => {
    const booked = bookedSlots.includes(slot);
    return (
      <option key={slot} value={slot} disabled={booked}>
        {booked ? `${slot} (Booked)` : slot}
      </option>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setInvalidFields((prev) => prev.filter((field) => field !== name));
  };

  const triggerInvalidShake = () => {
    if (!formRef.current) return [];
    const invalid = Array.from(formRef.current.querySelectorAll(':invalid'))
      .map((el) => el.name)
      .filter(Boolean);
    setInvalidFields(invalid);
    return invalid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formRef.current?.checkValidity()) {
      triggerInvalidShake();
      formRef.current?.reportValidity();
      return;
    }

    if (isSunday(form.preferredDate)) {
      setError('Appointments are not available on Sundays. Please choose another date.');
      setInvalidFields(['preferredDate']);
      return;
    }

    if (bookedSlots.includes(form.preferredTimeSlot)) {
      setError('This time slot is already booked. Please select another time.');
      setInvalidFields(['preferredTimeSlot']);
      return;
    }

    setLoading(true);

    try {
      await submitAppointmentRequest({
        patientName: form.patientName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        age: Number(form.age),
        gender: form.gender,
        reasonForVisit: form.reasonForVisit,
        preferredDate: form.preferredDate,
        preferredTimeSlot: form.preferredTimeSlot,
      });
      setSuccess(true);
      setForm(emptyForm);
      setBookedSlots([]);
      setInvalidFields([]);
      onSuccess?.();
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        setError(Object.values(fieldErrors).join(' '));
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError('Unable to submit your request. Please try again or call us directly.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-medical-200 bg-medical-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-medical-600 text-white">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-slate-900">Request Submitted!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your appointment request has been received. Our team will contact you shortly to confirm your booking.
        </p>
        <AnimatedButton
          type="button"
          onClick={() => setSuccess(false)}
          className="btn-primary mt-6"
        >
          Submit Another Request
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence>{loading && <FormSkeleton />}</AnimatePresence>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="patientName" className="mb-1.5 block text-sm font-medium text-slate-700">
              Patient Name *
            </label>
            <AnimatedInput
              id="patientName"
              name="patientName"
              type="text"
              required
              value={form.patientName}
              onChange={handleChange}
              placeholder="Full name"
              shake={invalidFields.includes('patientName')}
            />
          </div>

          <div>
            <label htmlFor="mobileNumber" className="mb-1.5 block text-sm font-medium text-slate-700">
              Mobile Number *
            </label>
            <AnimatedInput
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              required
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit mobile"
              shake={invalidFields.includes('mobileNumber')}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address *
            </label>
            <AnimatedInput
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
              shake={invalidFields.includes('email')}
            />
          </div>

          <div>
            <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-slate-700">
              Age *
            </label>
            <AnimatedInput
              id="age"
              name="age"
              type="number"
              min="0"
              max="120"
              required
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              shake={invalidFields.includes('age')}
            />
          </div>

          <div>
            <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-slate-700">
              Gender *
            </label>
            <AnimatedSelect
              id="gender"
              name="gender"
              required
              value={form.gender}
              onChange={handleChange}
              shake={invalidFields.includes('gender')}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </AnimatedSelect>
          </div>

          <div>
            <label htmlFor="preferredDate" className="mb-1.5 block text-sm font-medium text-slate-700">
              Preferred Date *
            </label>
            <AnimatedInput
              id="preferredDate"
              name="preferredDate"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={form.preferredDate}
              onChange={handleChange}
              shake={invalidFields.includes('preferredDate')}
            />
            {isSunday(form.preferredDate) && (
              <p className="mt-1 text-xs text-red-600">Sunday is closed. Please select another date.</p>
            )}
          </div>

          <div>
            <label htmlFor="preferredTimeSlot" className="mb-1.5 block text-sm font-medium text-slate-700">
              Preferred Time Slot *
            </label>
            <AnimatedSelect
              id="preferredTimeSlot"
              name="preferredTimeSlot"
              required
              value={form.preferredTimeSlot}
              onChange={handleChange}
              disabled={slotsLoading}
              shake={invalidFields.includes('preferredTimeSlot')}
            >
              <option value="">
                {slotsLoading ? 'Loading time slots...' : 'Select a time slot'}
              </option>
              <optgroup label="Morning (09:00 AM – 01:00 PM)">
                {ALL_TIME_SLOTS.slice(0, 8).map(renderTimeSlotOption)}
              </optgroup>
              <optgroup label="Evening (05:00 PM – 08:00 PM)">
                {ALL_TIME_SLOTS.slice(8).map(renderTimeSlotOption)}
              </optgroup>
            </AnimatedSelect>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="reasonForVisit" className="mb-1.5 block text-sm font-medium text-slate-700">
              Reason For Visit *
            </label>
            <AnimatedTextarea
              id="reasonForVisit"
              name="reasonForVisit"
              required
              rows={4}
              value={form.reasonForVisit}
              onChange={handleChange}
              placeholder="Briefly describe your symptoms or reason for visit"
              shake={invalidFields.includes('reasonForVisit')}
            />
          </div>
        </div>

        <AnimatedButton type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-60">
          Submit Appointment Request
        </AnimatedButton>
      </form>
    </div>
  );
}
