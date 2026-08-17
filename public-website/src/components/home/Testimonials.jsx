import {
  AnimatedCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../motion';
import { fadeUp, zoomIn } from '../../motion/constants';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient since 2022',
    quote: 'Dr. Tabassum took the time to explain everything clearly. The clinic is clean, modern, and the staff is incredibly warm and professional.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Patient since 2020',
    quote: 'Best healthcare experience I have had. Appointments are on time, and the treatment plans are thorough and personalized.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    role: 'Patient since 2023',
    quote: 'I brought my entire family here. From pediatric concerns to my mother\'s chronic care, they handle everything with compassion.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="container-custom">
        <ScrollReveal variants={fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical-600">Testimonials</p>
          <h2 className="section-title mx-auto">What Our Patients Say</h2>
          <p className="section-subtitle mx-auto">
            Real stories from people who trust us with their health and their families.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.15}>
          {testimonials.map((item) => (
            <StaggerItem key={item.name} variants={zoomIn}>
              <AnimatedCard reveal={false} className="flex h-full flex-col">
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-100 font-semibold text-medical-700">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
