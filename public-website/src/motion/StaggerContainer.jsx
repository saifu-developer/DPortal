import { motion } from 'framer-motion';
import { staggerContainer, VIEWPORT } from './constants';

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.12,
  delay = 0,
  viewport = VIEWPORT,
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer(stagger, delay)}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
