// src/Settings.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [keyboardLayout, setKeyboardLayout] = useState("qwerty");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div>
        <label className="block font-semibold">Keyboard Layout</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={keyboardLayout}
          onChange={(e) => setKeyboardLayout(e.target.value)}
        >
          <option value="qwerty">QWERTY</option>
          <option value="abc">ABC</option>
          <option value="numbers">123</option>
        </select>
      </div>
      <Link to="/" className="text-blue-600 underline">← Back to Keyboard</Link>
    </div>
  );
}
