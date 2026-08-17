import {
  AnimatedCard,
  AnimatedLink,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../motion';
import { fadeUp } from '../motion/constants';

const treatments = [
  {
    title: 'General Consultation',
    description: 'Comprehensive health evaluations, diagnosis, and personalized treatment plans for common illnesses.',
    icon: '🩺',
  },
  {
    title: 'Diabetes Care',
    description: 'Blood sugar monitoring, medication management, and lifestyle guidance for Type 1 & Type 2 diabetes.',
    icon: '💉',
  },
  {
    title: 'Hypertension Management',
    description: 'Blood pressure control, cardiac risk assessment, and long-term cardiovascular health planning.',
    icon: '❤️',
  },
  {
    title: 'Health Screenings',
    description: 'Preventive check-ups, lab tests, and early detection programs tailored to your age and risk profile.',
    icon: '🔬',
  },
  {
    title: 'Minor Procedures',
    description: 'Wound care, injections, ECG, nebulization, and other outpatient procedures in a safe clinical setting.',
    icon: '🏥',
  },
  {
    title: 'Chronic Care',
    description: 'Ongoing management for asthma, arthritis, thyroid disorders, and other long-term conditions.',
    icon: '📋',
  },
];

export default function Treatments() {
  return (
    <>
      <section className="bg-gradient-to-b from-medical-50 to-white py-16 sm:py-20">
        <ScrollReveal variants={fadeUp} className="container-custom text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical-600">Our Services</p>
          <h1 className="section-title mx-auto mt-2">Treatments & Services</h1>
          <p className="section-subtitle mx-auto">
            Comprehensive medical care delivered with expertise, empathy, and the latest clinical standards.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-custom">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {treatments.map((item) => (
              <StaggerItem key={item.title} variants={fadeUp}>
                <AnimatedCard reveal={false} className="group h-full">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal variants={fadeUp} className="mt-16">
            <div className="rounded-3xl bg-medical-50 p-8 text-center sm:p-12">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Not sure which service you need?
              </h2>
              <p className="mt-3 text-slate-600">
                Book a general consultation and our doctor will guide you to the right treatment plan.
              </p>
              <AnimatedLink to="/book-appointment" className="btn-primary mt-6">
                Book a Consultation
              </AnimatedLink>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
