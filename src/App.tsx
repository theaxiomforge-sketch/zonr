import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { EnforcementPage } from "./pages/EnforcementPage";
import { GuestPage } from "./pages/GuestPage";
import { ManagerPage } from "./pages/ManagerPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ResidentPage } from "./pages/ResidentPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/resident" element={<ResidentPage />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/enforcement" element={<EnforcementPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
