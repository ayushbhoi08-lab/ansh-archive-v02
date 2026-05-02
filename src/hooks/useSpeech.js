import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech() {
  const [speakingId, setSpeakingId] = useState(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', load);
    };
  }, []);

  const findVoice = (lang) => {
    const voices = voicesRef.current;
    return (
      voices.find(v => v.lang === lang) ||
      voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
      null
    );
  };

  const speak = useCallback((shlok) => {
    window.speechSynthesis.cancel();

    if (speakingId === shlok.id) {
      setSpeakingId(null);
      return;
    }

    setSpeakingId(shlok.id);

    const u1 = new SpeechSynthesisUtterance(shlok.sanskrit.replace(/।/g, '.').replace(/॥/g, '.'));
    u1.lang = 'hi-IN';
    u1.rate = 0.58;
    u1.pitch = 0.88;
    const hindiVoice = findVoice('hi-IN');
    if (hindiVoice) u1.voice = hindiVoice;

    const pause = new SpeechSynthesisUtterance(' ');
    pause.lang = 'en-US';
    pause.rate = 0.1;

    const u2 = new SpeechSynthesisUtterance(shlok.meaning);
    u2.lang = 'en-US';
    u2.rate = 0.82;
    u2.pitch = 1;
    const enVoice = findVoice('en-US');
    if (enVoice) u2.voice = enVoice;

    u2.onend = () => setSpeakingId(null);
    u2.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(u1);
    window.speechSynthesis.speak(pause);
    window.speechSynthesis.speak(u2);
  }, [speakingId]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  return { speak, stop, speakingId, isSpeaking: speakingId !== null };
}
