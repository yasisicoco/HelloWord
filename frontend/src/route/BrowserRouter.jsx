import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import NotFound from '../pages/NotFound';

function BrowserRouter() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default BrowserRouter;
