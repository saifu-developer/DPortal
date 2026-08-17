import { motion } from 'framer-motion';

export function StaggerItem({ children, className = '', variants, as = 'div', ...props }) {
  const Component = motion[as] || motion.div;

  return (
    <Component className={className} variants={variants} {...props}>
      {children}
    </Component>
  );
}
