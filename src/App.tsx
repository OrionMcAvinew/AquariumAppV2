import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TankDetail from './pages/TankDetail';
import AddTank from './pages/AddTank';
import AddParameter from './pages/AddParameter';
import Maintenance from './pages/Maintenance';
import Database from './pages/Database';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AIAdvisor from './pages/AIAdvisor';
import Equipment from './pages/Equipment';
import Compatibility from './pages/Compatibility';
import Calculators from './pages/Calculators';
import Wishlist from './pages/Wishlist';
import { useStore } from './store';

export default function App() {
  const seedData = useStore((s) => s.seedData);
  const seeded = useStore((s) => s.seeded);

  useEffect(() => {
    if (!seeded) {
      seedData();
    }
  }, [seeded, seedData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tanks/new" element={<AddTank />} />
          <Route path="tanks/:tankId" element={<TankDetail />} />
          <Route path="tanks/:tankId/log" element={<AddParameter />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="database" element={<Database />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="compatibility" element={<Compatibility />} />
          <Route path="calculators" element={<Calculators />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="ai" element={<AIAdvisor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
