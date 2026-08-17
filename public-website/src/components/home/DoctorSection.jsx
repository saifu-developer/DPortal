import { motion } from 'framer-motion';
import {
  AnimatedLink,
  CountUp,
  FloatingElement,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../motion';
import { fadeLeft, fadeRight, fadeUp } from '../../motion/constants';
import { DOCTOR_NAME, DOCTOR_IMAGE } from '../../constants/clinic';

export default function DoctorSection() {
  const listItems = [
    'MBBS, MD — Internal Medicine',
    'Member, American College of Physicians',
    'Special interest in diabetes & hypertension care',
    'Patient-first approach with evidence-based treatment',
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal variants={fadeRight} className="relative order-2 lg:order-1">
            <FloatingElement duration={6}>
              <img
                src={DOCTOR_IMAGE}
                alt={`${DOCTOR_NAME} in clinic`}
                className="rounded-3xl object-cover shadow-xl"
              />
            </FloatingElement>
            <motion.div
              className="absolute bottom-6 right-6 rounded-2xl bg-medical-600 px-5 py-4 text-white shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            >
              <p className="text-2xl font-bold">
                <CountUp value="15+" />
              </p>
              <p className="text-sm text-medical-100">Years of Practice</p>
            </motion.div>
          </ScrollReveal>

          <div className="order-1 lg:order-2">
            <ScrollReveal variants={fadeLeft}>
              <p className="text-sm font-semibold uppercase tracking-wide text-medical-600">Meet Your Doctor</p>
              <h2 className="section-title mt-2">{DOCTOR_NAME}</h2>
              <p className="section-subtitle">
                Board-certified physician specializing in internal medicine and preventive healthcare.
              </p>
            </ScrollReveal>

            <StaggerContainer as="ul" className="mt-8 space-y-4" stagger={0.1}>
              {listItems.map((item) => (
                <StaggerItem key={item} as="li" variants={fadeUp} className="flex items-start gap-3 text-slate-600">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-medical-100 text-medical-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                </StaggerItem>
              ))}
            </StaggerContainer>

            <ScrollReveal variants={fadeUp} delay={0.2}>
              <AnimatedLink to="/about" className="btn-outline mt-8">
                Learn More About Dr. Tabassum
              </AnimatedLink>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
