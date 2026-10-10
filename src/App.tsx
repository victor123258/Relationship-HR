import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Chrome } from "./components/Chrome";
import Apply from "./pages/Apply";
import Landing from "./pages/Landing";
import Report from "./pages/Report";
import SessionPage from "./pages/Session";
import Waiting from "./pages/Waiting";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Chrome>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/session/:code" element={<SessionPage />} />
          <Route path="/session/:code/apply" element={<Apply />} />
          <Route path="/session/:code/waiting" element={<Waiting />} />
          <Route path="/session/:code/report" element={<Report />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Chrome>
    </HashRouter>
  );
}
