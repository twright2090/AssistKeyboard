// Variables
let text = '';
let capsLock = false;
let shiftKey = false;  // Track if the Shift key is active
let customWords = ["so", "the"];
let isPlaying = false;
let isEditing = false;
let voices = [];  // Keep track of available voices

// Elements
const textInput = document.getElementById("textInput");
const speakBtn = document.getElementById("speakBtn");
const backspaceBtn = document.getElementById("backspaceBtn");
const capsLockBtn = document.getElementById("capsLockBtn");
const shiftBtn = document.getElementById("shiftBtn");
const customWordsContainer = document.getElementById("customWordsContainer");
const addCustomWordBtn = document.getElementById("addCustomWordBtn");
const editBtnCustom = document.getElementById("editBtn");
const keyboard = document.getElementById("keyboard");

const loadVoices = () => {
  voices = speechSynthesis.getVoices();

  if (voices.length === 0) {
    // If voices are not loaded, wait for the "voiceschanged" event
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
    };
  }
};

const speakText = () => {
  const utterance = new SpeechSynthesisUtterance(text);

  // Get the selected voice from localStorage, if available
  const selectedVoiceIndex = localStorage.getItem("selectedVoiceIndex");

  // Use the selected voice if available, otherwise default to the first voice
  const selectedVoice = voices[selectedVoiceIndex] || voices[0];
  utterance.voice = selectedVoice;

  if (speechSynthesis.speaking) {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      isPlaying = true;
    } else {
      speechSynthesis.pause();
      isPlaying = false;
    }
  } else {
    speechSynthesis.speak(utterance);
    isPlaying = true;
  }
};

// Update the Voice Dropdown
const updateVoiceSelect = () => {
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = '';  // Clear previous options
  
  // Populate the dropdown with voices
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = voice.name;
    voiceSelect.appendChild(option);
  });

}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadVoices(); // Ensure voices are loaded when the page is ready

  // Get the selected voice from localStorage and apply it to the select menu
  const selectedVoiceIndex = localStorage.getItem("selectedVoiceIndex");
  if (selectedVoiceIndex !== null) {
    const voiceSelect = document.getElementById("voiceSelect");
    voiceSelect.value = selectedVoiceIndex;
  }
});


// Handle Key Click
const handleKeyClick = (char) => {
  if (shiftKey && char !== "Space") {
    char = char.toUpperCase();
  } else {
    char = capsLock ? char.toUpperCase() : char.toLowerCase();
  }

  text += char;
  textInput.value = text;

  // Reset shiftKey after a key press to ensure it only affects one character at a time
  shiftKey = false;
  generateKeyboardLayout();  // Regenerate keyboard layout with shiftKey reset
};

// Handle Backspace
const handleBackspace = () => {
  text = text.slice(0, -1);
  textInput.value = text;
};

// Handle Custom Word Click
const handleCustomWordClick = (word) => {
  text += word + " ";
  textInput.value = text;
};

// Add Custom Word
const addCustomWord = () => {
  const newWord = prompt("Enter a new word or phrase:");
  if (newWord) {
    customWords.push(newWord);
    updateCustomWords();
  }
};

// Add/Remove Custom Words
function updateCustomWords() {
  customWordsContainer.innerHTML = '';  // Clear current custom words
  customWords.forEach((word, index) => {
    const wordButton = document.createElement('button');
    wordButton.textContent = word;
    wordButton.className = "btn btn-outline-secondary m-1";
    wordButton.onclick = () => handleCustomWordClick(word);
    customWordsContainer.appendChild(wordButton);

    // Add the delete button only if we are in "Edit" mode
    if (isEditing) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "btn btn-danger btn-sm m-1";
      deleteBtn.onclick = () => removeCustomWord(index);
      customWordsContainer.appendChild(deleteBtn);
    }
  });
}

function removeCustomWord(index) {
  customWords.splice(index, 1);
  updateCustomWords();  // Re-render after removal
}

// Toggle Edit Mode
editBtnCustom.addEventListener("click", () => {
  isEditing = !isEditing;
  editBtnCustom.textContent = isEditing ? "Done Editing" : "Edit";
  updateCustomWords();  // Re-render custom words with the new edit mode
});

// Initial Custom Words List
updateCustomWords();

// Generate Keyboard Layout
const generateKeyboardLayout = () => {
  const layouts = [
    "1234567890".split(""),
    [".", ",", "!", "?", ":", ";", "'", '"', "(", ")", "{", "}", "[", "]", "<", ">"].map(char => char),
    "qwertyuiop".split(""),
    "asdfghjkl".split(""),
    "zxcvbnm".split(""),
    ["Space"]
  ];

  // Clear the keyboard container before adding new buttons
  keyboard.innerHTML = '';

  layouts.forEach((row) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('d-flex', 'justify-content-center', 'mb-2');
    
    row.forEach((char) => {
      const btn = document.createElement('button');
      let buttonText = char;

      // Adjust for Caps Lock and Shift
      if (char !== "Space") {
        if (shiftKey) {
          buttonText = char.toUpperCase(); // Apply shift for one letter
        } else {
          buttonText = capsLock ? char.toUpperCase() : char.toLowerCase();
        }
      } else {
        buttonText = "␣";
      }

      btn.textContent = buttonText;
      btn.className = "btn btn-outline-secondary m-1";
      btn.onclick = () => handleKeyClick(char === "Space" ? " " : char);
      rowDiv.appendChild(btn);
    });

    keyboard.appendChild(rowDiv);
  });
};

// Toggle Caps Lock
const toggleCapsLock = () => {
  capsLock = !capsLock;
  capsLockBtn.textContent = capsLock ? "Caps Off" : "Caps On";
  generateKeyboardLayout(); // Regenerate the keyboard with Caps Lock state
};

// Toggle Shift
const toggleShift = () => {
  shiftKey = !shiftKey;
  generateKeyboardLayout(); // Regenerate the keyboard with Shift state
};


// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  generateKeyboardLayout();
  loadVoices(); // Ensure voices are loaded when the page is ready

  // Get the selected voice from localStorage and apply it to the select menu
  const selectedVoiceIndex = localStorage.getItem("selectedVoiceIndex");
  if (selectedVoiceIndex !== null) {
    const voiceSelect = document.getElementById("voiceSelect");
    voiceSelect.value = selectedVoiceIndex;
  }
});

speakBtn.addEventListener("click", speakText);
backspaceBtn.addEventListener("click", handleBackspace);
capsLockBtn.addEventListener("click", toggleCapsLock);
addCustomWordBtn.addEventListener("click", addCustomWord);

