import { useState } from 'react';

export default function App() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("female");
  const [keyboard, setKeyboard] = useState("qwerty");
  const [customWords, setCustomWords] = useState(["so", "the"]);
  const [spokenText, setSpokenText] = useState("");

  const speakText = () => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) {
      console.warn("No voices loaded yet.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.name.toLowerCase().includes(voice));
    if (selectedVoice) utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
    setSpokenText(text);
  };
  

  const handleKeyClick = (char) => {
    setText(prev => prev + char);
  };

  const handleCustomWordClick = (word) => {
    setText(prev => prev + word + " ");
  };

  const handleAddCustomWord = () => {
    const newWord = prompt("Enter a new word or phrase:");
    if (newWord) setCustomWords([...customWords, newWord]);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Assistive Keyboard</h1>
        <button onClick={speakText} className="px-4 py-2 bg-blue-500 text-white rounded">🔊</button>
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        className="w-full border rounded px-2 py-1"
      />

      <div className="grid grid-cols-8 gap-1">
        {keyboard === "qwerty" &&
          "qwertyuiopasdfghjklzxcvbnm ".split("").map((char, index) => (
            <button
              key={index}
              onClick={() => handleKeyClick(char)}
              className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {char === " " ? "␣" : char}
            </button>
          ))
        }
      </div>

      <div>
        <h2 className="font-semibold">Custom Words</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {customWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleCustomWordClick(word)}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {word}
            </button>
          ))}
          <button
            onClick={handleAddCustomWord}
            className="px-3 py-1 border rounded"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <label className="block font-medium">Voice</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={voice}
            onChange={e => setVoice(e.target.value)}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Keyboard Preset</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={keyboard}
            onChange={e => setKeyboard(e.target.value)}
          >
            <option value="qwerty">QWERTY</option>
            <option value="numbers">123</option>
          </select>
        </div>
      </div>
    </div>
    
  );
}
