import AppointmentForm from '../components/forms/AppointmentForm';
import { ScrollReveal } from '../components/motion';
import { fadeUp } from '../motion/constants';

export default function BookAppointment() {
  return (
    <>
      <section className="bg-gradient-to-b from-medical-50 to-white py-16 sm:py-20">
        <ScrollReveal variants={fadeUp} className="container-custom text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical-600">Book Appointment</p>
          <h1 className="section-title mx-auto mt-2">Schedule Your Visit</h1>
          <p className="section-subtitle mx-auto">
            Fill in the form below and our team will confirm your appointment shortly. All requests are reviewed within 24 hours.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-custom">
          <ScrollReveal variants={fadeUp} className="mx-auto max-w-2xl">
            <div className="card relative shadow-lg">
              <AppointmentForm />
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              For urgent medical emergencies, please call{' '}
              <a href="tel:+919876543210" className="font-medium text-medical-600 hover:underline">
                +91 98765 43210
              </a>{' '}
              directly.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
