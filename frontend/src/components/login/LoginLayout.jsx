import { useCallback, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { useReducedMotion } from 'framer-motion';
import BioTechLoginBackground from './BioTechLoginBackground';

export default function LoginLayout({ children }) {
  const reducedMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((event) => {
    setMouse({
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    });
  }, []);

  const card = (
    <div className="login-card-glass w-full">
      {children}
    </div>
  );

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      onMouseMove={reducedMotion ? undefined : handleMouseMove}
    >
      <BioTechLoginBackground mouse={mouse} />

      <div className="relative z-10 w-full max-w-md">
        {reducedMotion ? (
          card
        ) : (
          <Tilt
            tiltMaxAngleX={7}
            tiltMaxAngleY={7}
            perspective={1400}
            scale={1.015}
            transitionSpeed={900}
            gyroscope={false}
            glareEnable
            glareMaxOpacity={0.12}
            glareColor="#22d3ee"
            glarePosition="all"
            glareBorderRadius="1.25rem"
            className="w-full transform-gpu"
          >
            {card}
          </Tilt>
        )}
      </div>
    </div>
  );
}
