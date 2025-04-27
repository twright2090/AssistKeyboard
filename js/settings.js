let voices = [];
let selectedVoice = null;

// Load voices and populate the voice select dropdown
const loadVoices = () => {
  voices = speechSynthesis.getVoices();

  if (voices.length === 0) {
    // If voices are not loaded yet, wait for the "voiceschanged" event
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      populateVoiceSelect(voices);
    };
  } else {
    populateVoiceSelect(voices);
  }
};

// Populate the voice selection dropdown
const populateVoiceSelect = (voices) => {
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = ''; // Clear previous options

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = voice.name;
    voiceSelect.appendChild(option);
  });

  // Set the selected voice from localStorage (if available)
  const selectedVoiceIndex = localStorage.getItem("selectedVoiceIndex");
  if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
    voiceSelect.value = selectedVoiceIndex;
    selectedVoice = voices[selectedVoiceIndex];
  }
};

// Set the selected voice when the dropdown changes
const onVoiceChange = () => {
  const voiceSelect = document.getElementById("voiceSelect");
  selectedVoice = voices[voiceSelect.value];

  // Save the selected voice index to localStorage
  localStorage.setItem("selectedVoiceIndex", voiceSelect.value);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadVoices(); // Load voices when the page is loaded
  document.getElementById("voiceSelect").addEventListener("change", onVoiceChange);
});

