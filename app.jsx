import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("female");
  const [keyboard, setKeyboard] = useState("qwerty");
  const [customWords, setCustomWords] = useState(["so", "the"]);
  const [spokenText, setSpokenText] = useState("");

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(v => v.name.toLowerCase().includes(voice));
      speechSynthesis.speak(utterance);
      setSpokenText(text);
    }
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
        <Button onClick={() => speakText()}>🔊</Button>
      </div>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        className="w-full"
      />

      <div className="grid grid-cols-8 gap-1">
        {keyboard === "qwerty" &&
          "qwertyuiopasdfghjklzxcvbnm ".split("").map((char, index) => (
            <Button key={index} onClick={() => handleKeyClick(char)}>{char}</Button>
          ))
        }
      </div>

      <div>
        <h2 className="font-semibold">Custom Words</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {customWords.map((word, index) => (
            <Button key={index} onClick={() => handleCustomWordClick(word)}>{word}</Button>
          ))}
          <Button variant="outline" onClick={handleAddCustomWord}>+</Button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <label className="block font-medium">Voice</label>
          <select className="w-full border rounded" value={voice} onChange={e => setVoice(e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Keyboard Preset</label>
          <select className="w-full border rounded" value={keyboard} onChange={e => setKeyboard(e.target.value)}>
            <option value="qwerty">QWERTY</option>
            <option value="numbers">123</option>
          </select>
        </div>
      </div>
    </div>
  );
}
