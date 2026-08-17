import Testimonials from '../components/home/Testimonials';
import {
  AnimatedCard,
  FloatingElement,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../components/motion';
import { fadeLeft, fadeRight, fadeUp } from '../motion/constants';
import { DOCTOR_NAME, DOCTOR_IMAGE } from '../constants/clinic';

const qualifications = [
  'MBBS — All India Institute of Medical Sciences',
  'MD — Internal Medicine, Johns Hopkins University',
  'Fellowship — Preventive & Lifestyle Medicine',
  'Certified — Advanced Cardiac Life Support (ACLS)',
];

const expertise = [
  'General & Internal Medicine',
  'Diabetes & Hypertension Management',
  'Preventive Health Screenings',
  'Chronic Disease Management',
  'Women\'s Health & Wellness',
  'Geriatric Care',
];

export default function AboutDoctor() {
  return (
    <>
      <section className="bg-gradient-to-b from-medical-50 to-white py-16 sm:py-20">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal variants={fadeLeft}>
              <p className="text-sm font-semibold uppercase tracking-wide text-medical-600">About Doctor</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-slate-900 sm:text-5xl">
                {DOCTOR_NAME}
              </h1>
              <p className="mt-2 text-lg text-medical-700">MD, Internal Medicine</p>
              <p className="mt-6 leading-relaxed text-slate-600">
                {DOCTOR_NAME} is a dedicated physician with over 15 years of experience in internal
                medicine and preventive healthcare. She believes in treating the whole person — not just
                symptoms — and building long-term relationships with her patients based on trust and open communication.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                After completing her medical training at premier institutions in India and the United States,
                Dr. Tabassum returned to serve her community with a vision of accessible, high-quality healthcare
                for every patient who walks through the clinic doors.
              </p>
            </ScrollReveal>

            <ScrollReveal variants={fadeRight}>
              <FloatingElement duration={5} className="relative">
                <img
                  src={DOCTOR_IMAGE}
                  alt={DOCTOR_NAME}
                  className="mx-auto rounded-3xl object-cover shadow-2xl lg:max-h-[520px]"
                />
              </FloatingElement>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2">
          <ScrollReveal variants={fadeLeft}>
            <AnimatedCard reveal={false}>
              <h2 className="font-display text-xl font-bold text-slate-900">Qualifications</h2>
              <ul className="mt-6 space-y-3">
                {qualifications.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 text-medical-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          </ScrollReveal>

          <ScrollReveal variants={fadeRight}>
            <AnimatedCard reveal={false}>
              <h2 className="font-display text-xl font-bold text-slate-900">Areas of Expertise</h2>
              <StaggerContainer className="mt-6 grid gap-3 sm:grid-cols-2" stagger={0.08}>
                {expertise.map((item) => (
                  <StaggerItem key={item} variants={fadeUp}>
                    <div className="rounded-xl bg-medical-50 px-4 py-3 text-sm font-medium text-medical-800">
                      {item}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </AnimatedCard>
          </ScrollReveal>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
