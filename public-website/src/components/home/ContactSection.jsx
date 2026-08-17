import { motion } from 'framer-motion';
import {
  AnimatedLink,
  ParallaxLayer,
  ScrollReveal,
} from '../motion';
import { fadeUp } from '../../motion/constants';

export default function ContactSection() {
  return (
    <ScrollReveal variants={fadeUp}>
      <section className="py-16 sm:py-24">
        <div className="container-custom">
          <motion.div
            className="overflow-hidden rounded-3xl bg-medical-700 shadow-xl"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="text-sm font-semibold uppercase tracking-wide text-medical-200">Get In Touch</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                  Ready to Take Care of Your Health?
                </h2>
                <p className="mt-4 text-medical-100">
                  Visit us at the clinic or book an appointment online. We respond to all inquiries within 24 hours.
                </p>

                <ul className="mt-8 space-y-4 text-sm text-white">
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    123 Health Avenue, Medical District, City 400001
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    +91 98765 43210
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    info@kurepulseclinic.com
                  </li>
                </ul>

                <div className="mt-8 flex flex-wrap gap-4">
                  <AnimatedLink
                    to="/book-appointment"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-medical-700 transition hover:bg-medical-50"
                  >
                    Book Appointment
                  </AnimatedLink>
                  <AnimatedLink
                    to="/contact"
                    className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Contact Us
                  </AnimatedLink>
                </div>
              </div>

              <ParallaxLayer offset={25} className="hidden lg:block">
                <div className="h-full bg-medical-800/50">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop"
                    alt="KurePulse Clinic reception"
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
              </ParallaxLayer>
            </div>
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}
