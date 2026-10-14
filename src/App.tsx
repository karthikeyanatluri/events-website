import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EventsPage from "./pages/Events/EventsPage";
import MidwayNights from "./MidwayNights";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/midway-nights" element={<MidwayNights />} />
        <Route path="/register" element={<Navigate to="/midway-nights#register" replace />} />
        <Route path="/about" element={<Navigate to="/midway-nights#about" replace />} />
        <Route path="/contact" element={<Navigate to="/midway-nights#contact" replace />} />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
