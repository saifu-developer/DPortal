import { AnimatedCard, ScrollReveal } from './motion';
import { fadeLeft, fadeRight } from '../motion/constants';

export default function ConsultationTimings({ className = '' }) {
  return (
    <AnimatedCard reveal={false} className={`border-medical-100 bg-gradient-to-br from-white to-medical-50/40 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-medical-100 text-medical-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-slate-900">Consultation Timings</h3>
          <p className="mt-1 text-sm font-medium text-medical-700">Monday – Saturday</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ScrollReveal variants={fadeLeft}>
              <div className="rounded-xl border border-medical-100 bg-white/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-medical-600">Morning</p>
                <p className="mt-1 text-sm font-medium text-slate-800">09:00 AM – 01:00 PM</p>
              </div>
            </ScrollReveal>
            <ScrollReveal variants={fadeRight}>
              <div className="rounded-xl border border-medical-100 bg-white/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-medical-600">Evening</p>
                <p className="mt-1 text-sm font-medium text-slate-800">05:00 PM – 08:00 PM</p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal variants={fadeLeft}>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sunday</span>
              <span className="text-sm font-medium text-slate-700">Closed</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </AnimatedCard>
  );
}
