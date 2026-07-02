'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, KEYS } from '../storage/adapter';

export function useTour() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const completed = storage.get<boolean>(KEYS.tourCompleted);
    if (!completed) setShow(true);
  }, []);

  const completeTour = useCallback(() => {
    storage.set(KEYS.tourCompleted, true);
    setShow(false);
  }, []);

  const resetTour = useCallback(() => {
    storage.remove(KEYS.tourCompleted);
    setShow(true);
  }, []);

  return { show, completeTour, resetTour };
}
