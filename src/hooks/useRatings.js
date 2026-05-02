import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ansh-ratings';

function getStoredRatings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

export function useRatings() {
  const [ratings, setRatings] = useState(getStoredRatings);

  const hasRated = useCallback((recordingId) => {
    return !!ratings[recordingId];
  }, [ratings]);

  const getRating = useCallback((recordingId) => {
    return ratings[recordingId] || null;
  }, [ratings]);

  const submitRating = useCallback((recordingId, values) => {
    const entry = {
      ...values,
      submittedAt: new Date().toISOString(),
    };
    setRatings(prev => {
      const next = { ...prev, [recordingId]: entry };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    // Also try to sync to server if available
    try {
      const sessionId = localStorage.getItem('ansh-session-id') || 'anonymous';
      fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, recordingId, ...values }),
      }).catch(() => {});
    } catch { /* offline is fine */ }

    return entry;
  }, []);

  return {
    ratings,
    hasRated,
    getRating,
    submitRating,
  };
}
