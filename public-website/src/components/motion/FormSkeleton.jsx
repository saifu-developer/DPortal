import { motion } from 'framer-motion';

function SkeletonBar({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
  );
}

export default function FormSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 rounded-2xl bg-white/90 p-6 backdrop-blur-sm"
    >
      <div className="space-y-5">
        <SkeletonBar className="h-4 w-24" />
        <SkeletonBar className="h-12 w-full" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <SkeletonBar className="mb-2 h-4 w-28" />
            <SkeletonBar className="h-12 w-full" />
          </div>
          <div>
            <SkeletonBar className="mb-2 h-4 w-28" />
            <SkeletonBar className="h-12 w-full" />
          </div>
          <div>
            <SkeletonBar className="mb-2 h-4 w-16" />
            <SkeletonBar className="h-12 w-full" />
          </div>
          <div>
            <SkeletonBar className="mb-2 h-4 w-20" />
            <SkeletonBar className="h-12 w-full" />
          </div>
        </div>
        <SkeletonBar className="h-4 w-32" />
        <SkeletonBar className="h-24 w-full" />
        <SkeletonBar className="h-12 w-48 rounded-full" />
      </div>
    </motion.div>
  );
}
