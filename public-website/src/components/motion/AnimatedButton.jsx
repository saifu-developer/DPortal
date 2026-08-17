import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EASE_OUT } from '../../motion/constants';

const motionProps = {
  whileHover: {
    scale: 1.05,
    filter: 'brightness(1.05)',
    boxShadow: '0 8px 24px -4px rgb(13 148 136 / 0.35)',
  },
  whileTap: { scale: 0.96 },
  transition: { duration: 0.3, ease: EASE_OUT },
};

const MotionLink = motion.create(Link);

export function AnimatedButton({ children, className = '', type = 'button', ...props }) {
  return (
    <motion.button type={type} className={className} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
}

export function AnimatedLink({ children, className = '', to, ...props }) {
  return (
    <MotionLink to={to} className={className} {...motionProps} {...props}>
      {children}
    </MotionLink>
  );
}

export function AnimatedAnchor({ children, className = '', href, ...props }) {
  return (
    <motion.a href={href} className={className} {...motionProps} {...props}>
      {children}
    </motion.a>
  );
}
