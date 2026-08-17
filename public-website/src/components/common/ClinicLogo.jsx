import { CLINIC_LOGO, CLINIC_NAME } from '../../constants/clinic';

export default function ClinicLogo({ className = 'h-10 w-auto', alt = CLINIC_NAME }) {
  return (
    <img src={CLINIC_LOGO} alt={alt} className={className} draggable={false} />
  );
}
