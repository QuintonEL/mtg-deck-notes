import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/new" element={<h1>New</h1>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
