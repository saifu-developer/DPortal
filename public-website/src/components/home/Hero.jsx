import { motion, useScroll, useTransform } from 'framer-motion';
import {
  AnimatedBackground,
  AnimatedLink,
  CountUp,
  FloatingElement,
  ParallaxBackground,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../motion';
import { fadeLeft, fadeRight, scaleUp, staggerContainer, fadeUp } from '../../motion/constants';
import { CLINIC_FULL_NAME, DOCTOR_NAME, DOCTOR_IMAGE } from '../../constants/clinic';

export default function Hero() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.85]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-medical-50 via-white to-slate-50">
      <ParallaxBackground>
        <AnimatedBackground />
      </ParallaxBackground>

      <motion.div style={{ opacity: heroOpacity }} className="container-custom relative py-16 sm:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal variants={scaleUp}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.1, 0.1)}
            >
              <StaggerItem variants={fadeLeft}>
                <span className="inline-flex items-center rounded-full bg-medical-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-medical-700">
                  Trusted Healthcare
                </span>
              </StaggerItem>
              <StaggerItem variants={fadeLeft}>
                <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Your Health, Our <span className="text-medical-600">Priority</span>
                </h1>
              </StaggerItem>
              <StaggerItem variants={fadeLeft}>
                <p className="mt-6 text-lg leading-relaxed text-slate-600">
                  Expert medical care with a personal touch. From routine check-ups to specialized treatments,
                  we are committed to your well-being every step of the way.
                </p>
              </StaggerItem>
              <StaggerItem variants={fadeLeft}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <AnimatedLink to="/book-appointment" className="btn-primary">
                    Book Appointment
                  </AnimatedLink>
                  <AnimatedLink to="/treatments" className="btn-outline">
                    View Treatments
                  </AnimatedLink>
                </div>
              </StaggerItem>

              <StaggerContainer className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8" stagger={0.15}>
                <StaggerItem variants={fadeUp}>
                  <p className="font-display text-2xl font-bold text-medical-700">
                    <CountUp value="15+" />
                  </p>
                  <p className="text-sm text-slate-500">Years Experience</p>
                </StaggerItem>
                <StaggerItem variants={fadeUp}>
                  <p className="font-display text-2xl font-bold text-medical-700">
                    <CountUp value="5000+" />
                  </p>
                  <p className="text-sm text-slate-500">Happy Patients</p>
                </StaggerItem>
                <StaggerItem variants={fadeUp}>
                  <p className="font-display text-2xl font-bold text-medical-700">
                    <CountUp value="24/7" />
                  </p>
                  <p className="text-sm text-slate-500">Emergency Care</p>
                </StaggerItem>
              </StaggerContainer>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal variants={fadeRight}>
            <FloatingElement duration={5.5} className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-medical-100/60" />
              <motion.img
                src={DOCTOR_IMAGE}
                alt={`${DOCTOR_NAME} at ${CLINIC_FULL_NAME}`}
                className="relative rounded-3xl object-cover shadow-2xl shadow-medical-900/10"
                style={{ willChange: 'transform' }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p className="text-sm font-semibold text-slate-900">{DOCTOR_NAME}</p>
                <p className="text-xs text-medical-600">MD, Internal Medicine</p>
              </motion.div>
            </FloatingElement>
          </ScrollReveal>
        </div>
      </motion.div>
    </section>
  );
}
