// src/Settings.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [keyboardLayout, setKeyboardLayout] = useState("qwerty");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(
    localStorage.getItem("preferredVoice") || ""
  );

  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      setVoices(synthVoices);
      if (synthVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(synthVoices[0].name);
        localStorage.setItem("preferredVoice", synthVoices[0].name);
      }
    };

    loadVoices();
    if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const handleVoiceChange = (e) => {
    const voice = e.target.value;
    setSelectedVoice(voice);
    localStorage.setItem("preferredVoice", voice);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

    
      {/* Voice Selection */}
      <div>
        <label className="block font-semibold">Voice</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={selectedVoice}
          onChange={handleVoiceChange}
        >
          {voices.map((v, index) => (
            <option key={index} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </div>

      <Link to="/" className="text-blue-600 underline">← Back to Keyboard</Link>
    </div>
  );
}

