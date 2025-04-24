// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Settings from './Settings'; // make sure this exists or create a simple component

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
