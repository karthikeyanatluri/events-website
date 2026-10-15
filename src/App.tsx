import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TicketsPage from "./pages/EventsPage/TicketsPage";
import EventsPage from "./pages/EventsPage/EventsPage";
import MidwayNights from "./MidwayNights";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/events" element={<TicketsPage />} />
        <Route path="/events/:school" element={<EventsPage />} />
        <Route path="/midway-nights" element={<MidwayNights />} />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

