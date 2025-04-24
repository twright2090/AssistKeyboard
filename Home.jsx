//Home.jsx
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


export default function Home() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [voices, setVoices] = useState([]);
  const [keyboard, setKeyboard] = useState("qwerty");
  const [customWords, setCustomWords] = useState(["so", "the"]);
  const [spokenText, setSpokenText] = useState("");

  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      if (synthVoices.length > 0) {
        setVoices(synthVoices);
        setVoice(synthVoices[0].name); // Set default
      }
    };

    if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
}, []);

const speakText = () => {

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.name === voice);
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
    setSpokenText(text);
  };

  const handleKeyClick = (char) => setText(prev => prev + char);
  const handleCustomWordClick = (word) => setText(prev => prev + word + " ");
  const handleAddCustomWord = () => {
    const newWord = prompt("Enter a new word or phrase:");
    if (newWord) setCustomWords([...customWords, newWord]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Assistive Keyboard</h1>
        <div className="space-x-2">
          <button onClick={speakText}>🔊</button>
          <Link to="/settings"><button>⚙️ Settings</button></Link>
        </div>
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." className="w-full border rounded px-2 py-1" />

      <div className="grid grid-cols-8 gap-1">
        {keyboard === "qwerty" &&
          "qwertyuiopasdfghjklzxcvbnm ".split("").map((char, index) => (
            <button key={index} onClick={() => handleKeyClick(char)} className="p-2 border rounded bg-gray-100 hover:bg-gray-200">
              {char === " " ? "␣" : char}
            </button>
          ))}
      </div>

      <div>
        <h2 className="font-semibold">Custom Words</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {customWords.map((word, index) => (
            <button key={index} onClick={() => handleCustomWordClick(word)} className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">
              {word}
            </button>
          ))}
          <button onClick={handleAddCustomWord} className="px-3 py-1 border rounded">+</button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <label className="block font-medium">Voice</label>
          <select className="w-full border rounded px-2 py-1" value={voice} onChange={e => setVoice(e.target.value)}>
          {voices.map((v, idx) => (
               <option key={idx} value={v.name}>
                 {v.name} ({v.lang})
               </option>
             ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Keyboard Preset</label>
          <select className="w-full border rounded px-2 py-1" value={keyboard} onChange={e => setKeyboard(e.target.value)}>
            <option value="qwerty">QWERTY</option>
            <option value="numbers">123</option>
          </select>
        </div>
      </div>
    </div>
  );
}
