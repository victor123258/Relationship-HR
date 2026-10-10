import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppProviders } from "./context/SessionContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "./components/ui/Toast";
import { LandingPage } from "./pages/LandingPage";
import { SessionDashboard } from "./pages/SessionDashboard";
import { FormPage } from "./pages/FormPage";
import { WaitingRoom } from "./pages/WaitingRoom";
import { ResultsPage } from "./pages/ResultsPage";
import { SharedReportPage } from "./pages/SharedReportPage";
import { ImportPage } from "./pages/ImportPage";

function Shell() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="paper-bg flex min-h-screen flex-col">
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/session/:code" element={<SessionDashboard />} />
          <Route path="/session/:code/form" element={<FormPage />} />
          <Route path="/session/:code/waiting" element={<WaitingRoom />} />
          <Route path="/session/:code/results" element={<ResultsPage />} />
          <Route path="/session/:code/import/:data" element={<ImportPage />} />
          <Route path="/shared/:data" element={<SharedReportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <HashRouter>
        <Shell />
      </HashRouter>
    </AppProviders>
  );
}
