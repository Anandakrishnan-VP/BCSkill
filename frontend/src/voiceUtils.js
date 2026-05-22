let currentAudio = null;

export const speakText = async (text, lang = 'en-US', onEnd = null) => {
  // Cancel any ongoing speech
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  
  try {
    const res = await fetch('http://localhost:8000/generate_audio', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text, language: lang})
    });
    const data = await res.json();
    
    if (data.status === 'success') {
      const audioSrc = 'data:audio/mp3;base64,' + data.audio_base64;
      currentAudio = new Audio(audioSrc);
      
      if (onEnd) {
        currentAudio.onended = onEnd;
      }
      
      currentAudio.play();
    } else {
      if (onEnd) onEnd();
    }
  } catch (e) {
    console.error("ElevenLabs TTS Error:", e);
    // Fallback to browser TTS if API fails
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        if (onEnd) utterance.onend = onEnd;
        window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }
};

export const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const startListening = (lang = 'en-US', onResult, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError("Speech recognition not supported");
    return null;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };
  
  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };
  
  recognition.start();
  return recognition;
};
