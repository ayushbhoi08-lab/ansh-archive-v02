import { useState, useCallback, useEffect } from 'react';
import { shlokas } from '../data/shlokas';

const GATE_COUNT = 9;
const LISTEN_THRESHOLD = 30; // seconds
const STORAGE_KEY = 'ansh-gate-progress';
const SESSION_KEY = 'ansh-session-id';

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getInitialProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

// The 9 gate shlokas: first 9 in the array (or specific selection)
const gateShlokaIds = shlokas.slice(0, GATE_COUNT).map(s => s.id);

export function useGateProgress() {
  const [progress, setProgress] = useState(getInitialProgress);
  const sessionId = getSessionId();

  const saveProgress = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProgress(next);
  }, []);

  const reportListen = useCallback((shlokaId, seconds) => {
    if (!gateShlokaIds.includes(shlokaId)) return;
    setProgress(prev => {
      const current = prev[shlokaId] || { seconds: 0, completed: false };
      const newSeconds = Math.max(current.seconds, seconds);
      const completed = newSeconds >= LISTEN_THRESHOLD;
      const next = { ...prev, [shlokaId]: { seconds: newSeconds, completed } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isCompleted = useCallback((shlokaId) => {
    return !!progress[shlokaId]?.completed;
  }, [progress]);

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const isUnlocked = completedCount >= GATE_COUNT;

  const resetGate = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({});
  }, []);

  const getGateShlokas = useCallback(() => {
    return shlokas.slice(0, GATE_COUNT).map(s => ({
      ...s,
      progress: progress[s.id] || { seconds: 0, completed: false }
    }));
  }, [progress]);

  return {
    sessionId,
    progress,
    completedCount,
    isUnlocked,
    reportListen,
    isCompleted,
    resetGate,
    getGateShlokas,
    gateShlokaIds,
    gateTotal: GATE_COUNT,
  };
}
