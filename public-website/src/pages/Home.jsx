import Hero from '../components/home/Hero';
import DoctorSection from '../components/home/DoctorSection';
import Testimonials from '../components/home/Testimonials';
import ContactSection from '../components/home/ContactSection';
import ConsultationTimings from '../components/ConsultationTimings';
import { ScrollReveal } from '../components/motion';
import { fadeUp } from '../motion/constants';

export default function Home() {
  return (
    <>
      <Hero />
      <DoctorSection />
      <section className="pb-8 sm:pb-12">
        <div className="container-custom">
          <ScrollReveal variants={fadeUp} className="mx-auto max-w-2xl">
            <ConsultationTimings />
          </ScrollReveal>
        </div>
      </section>
      <Testimonials />
      <ContactSection />
    </>
  );
}
