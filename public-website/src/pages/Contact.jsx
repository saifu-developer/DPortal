import ContactSection from '../components/home/ContactSection';
import ConsultationTimings from '../components/ConsultationTimings';
import {
  AnimatedCard,
  ScrollReveal,
} from '../components/motion';
import { fadeLeft, fadeRight, fadeUp } from '../motion/constants';

const contactCards = [
  {
    title: 'Visit Us',
    detail: '123 Health Avenue, Medical District, City 400001',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    ),
  },
  {
    title: 'Call Us',
    detail: '+91 98765 43210',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
  },
  {
    title: 'Email Us',
    detail: 'info@kurepulseclinic.com',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
];

const cardVariants = [fadeLeft, fadeUp, fadeRight];

export default function Contact() {
  return (
    <>
      <section className="bg-gradient-to-b from-medical-50 to-white py-16 sm:py-20">
        <ScrollReveal variants={fadeUp} className="container-custom text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical-600">Contact Us</p>
          <h1 className="section-title mx-auto mt-2">We&apos;re Here to Help</h1>
          <p className="section-subtitle mx-auto">
            Reach out for appointments, inquiries, or emergency guidance. Our team is ready to assist you.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-8">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-3">
            {contactCards.map((item, index) => (
              <ScrollReveal key={item.title} variants={cardVariants[index % cardVariants.length]}>
                <AnimatedCard reveal={false} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-medical-100 text-medical-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="mt-4 font-display font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variants={fadeUp} className="mx-auto mt-8 max-w-2xl">
            <ConsultationTimings />
          </ScrollReveal>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
