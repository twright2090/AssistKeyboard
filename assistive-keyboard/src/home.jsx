import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export default function Home() {
  const [text, setText] = useState("");
  const [keyboard, setKeyboard] = useState("qwerty");
  const [customWords, setCustomWords] = useState(["so", "the"]);
  const [spokenText, setSpokenText] = useState("");
  const [capsLock, setCapsLock] = useState(false); // Track the state of Caps Lock
  const [isEditing, setIsEditing] = useState(false); // Track if we are in edit mode
  const [isPlaying, setIsPlaying] = useState(false); // Track if the speech is playing

  const speakText = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (speechSynthesis.speaking) {
      // If already speaking, pause it
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        setIsPlaying(true); // Resume speaking
      } else {
        speechSynthesis.pause();
        setIsPlaying(false); // Pause speaking
      }
    } else {
      // Start speaking if not speaking
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
    setSpokenText(text);
  };

  const handleKeyClick = (char) => setText(prev => prev + char);
  const handleCustomWordClick = (word) => setText(prev => prev + word + " ");
  const handleAddCustomWord = () => {
    const newWord = prompt("Enter a new word or phrase:");
    if (newWord) setCustomWords([...customWords, newWord]);
  };

  const handleRemoveCustomWord = (index) => {
    setCustomWords(customWords.filter((_, i) => i !== index));
  };

  const handleBackspace = () => setText(prev => prev.slice(0, -1)); // Remove last character

  const handleCapsLockToggle = () => setCapsLock(prev => !prev); // Toggle Caps Lock

  // Helper to handle characters for Caps Lock
  const adjustForCapsLock = (char) => {
    return capsLock ? char.toUpperCase() : char.toLowerCase();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Assistive Keyboard</h1>
        <div className="space-x-2">
          <button onClick={speakText}>
            {"▶️"} {/* Play/Pause button */}
          </button>
          <Link to="/settings"><button>Settings</button></Link>
        </div>
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." className="w-full border rounded px-2 py-1" />

      {/* Keyboard Layout */}
      <div>
        {/* Numbers Layout */}
        <div className="grid grid-cols-10 gap-1 mb-2">
          {"1234567890".split("").map((char, index) => (
            <button
              key={index}
              onClick={() => handleKeyClick(char)}
              className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {char}
            </button>
          ))}
        </div>

        {/* Punctuation Layout */}
        <div className="grid grid-cols-10 gap-1 mb-2">
          {".,!?:;\"'(){}[]<>".split("").map((char, index) => (
            <button
              key={index}
              onClick={() => handleKeyClick(char)}
              className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {char}
            </button>
          ))}
        </div>

        {/* QWERTY Layout */}
        <div className="grid grid-cols-10 gap-1">
          {"qwertyuiop".split("").map((char, index) => (
            <button
              key={index}
              onClick={() => handleKeyClick(adjustForCapsLock(char))}
              className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {adjustForCapsLock(char)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-9 gap-1">
          {"asdfghjkl".split("").map((char, index) => (
            <button
              key={index + 10}
              onClick={() => handleKeyClick(adjustForCapsLock(char))}
              className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {adjustForCapsLock(char)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-8 gap-1">
          {"zxcvbnm ".split("").map((char, index) => (
            <button
              key={index + 19}
              onClick={() => handleKeyClick(adjustForCapsLock(char))}
              className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              {char === " " ? "␣" : adjustForCapsLock(char)}
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons: Backspace and Caps Lock */}
      <div className="flex space-x-2 mt-4">
        <button onClick={handleBackspace} className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">⌫</button>
        <button onClick={handleCapsLockToggle} className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">
          {capsLock ? "Caps Off" : "Caps On"}
        </button>
      </div>

      <div>
        <h2 className="font-semibold">Custom Words</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {customWords.map((word, index) => (
            <div key={index} className="flex items-center space-x-2">
              <button
                onClick={() => handleCustomWordClick(word)}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              >
                {word}
              </button>
              {isEditing && (
                <button
                  onClick={() => handleRemoveCustomWord(index)}
                  className="px-3 py-1 border rounded bg-red-100 hover:bg-red-200"
                >
                  DELETE
                </button>
              )}
            </div>
          ))}
          <button onClick={handleAddCustomWord} className="px-3 py-1 border rounded">+</button>
        </div>
        <button 
          onClick={() => setIsEditing(prev => !prev)} 
          className="mt-2 px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          {isEditing ? "Done Editing" : "Edit"}
        </button>
      </div>
    </div>
  );
}
