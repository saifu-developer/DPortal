import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Home from '../pages/Home';
import AboutDoctor from '../pages/AboutDoctor';
import Treatments from '../pages/Treatments';
import Contact from '../pages/Contact';
import BookAppointment from '../pages/BookAppointment';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutDoctor />} />
        <Route path="treatments" element={<Treatments />} />
        <Route path="contact" element={<Contact />} />
        <Route path="book-appointment" element={<BookAppointment />} />
      </Route>
    </Routes>
  );
}
