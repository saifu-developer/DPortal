import { Link } from 'react-router-dom';
import { ScrollReveal } from '../motion';
import { fadeIn } from '../../motion/constants';
import { CLINIC_FULL_NAME } from '../../constants/clinic';
import ClinicLogo from '../common/ClinicLogo';

export default function Footer() {
  return (
    <ScrollReveal variants={fadeIn}>
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="container-custom py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <ClinicLogo className="mb-3 h-10 w-auto" alt={CLINIC_FULL_NAME} />
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Compassionate, patient-centered healthcare with modern diagnostics and personalized treatment plans.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Quick Links</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><Link to="/about" className="hover:text-medical-600">About Doctor</Link></li>
                <li><Link to="/treatments" className="hover:text-medical-600">Treatments</Link></li>
                <li><Link to="/contact" className="hover:text-medical-600">Contact</Link></li>
                <li><Link to="/book-appointment" className="hover:text-medical-600">Book Appointment</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Contact</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>123 Health Avenue, Medical District</li>
                <li>+91 98765 43210</li>
                <li>info@kurepulseclinic.com</li>
                <li>Mon – Sat: 9:00 AM – 7:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} {CLINIC_FULL_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </ScrollReveal>
  );
}
