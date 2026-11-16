'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { useTheme } from '../theme/context';

export interface SnackbarOptions {
  message: string;
  /** One short action, like "Undo" or "Retry" */
  action?: { label: string; onPress: () => void };
  /** How long it stays, in ms. Defaults to the theme's `snackbar.duration` */
  duration?: number;
}

export interface SnackbarApi {
  /** Shows a snackbar, after any that are already showing */
  show: (options: SnackbarOptions | string) => void;
  /** Hides the current snackbar now */
  hide: () => void;
}

export interface QueuedSnackbar extends SnackbarOptions {
  id: number;
  /** Time left on screen, in ms; counts down only while not paused */
  remaining: number;
}

export interface SnackbarViewProps {
  snackbar?: QueuedSnackbar;
  onAction: () => void;
  /** Stops the timer while the pointer is over it or it has focus */
  onPause: () => void;
  onResume: () => void;
}

const SnackbarContext = createContext<SnackbarApi | null>(null);

/** Shows short messages at the bottom of the screen. Needs a `SnackbarProvider` above it */
export function useSnackbar() {
  const api = useContext(SnackbarContext);
  if (!api) {
    throw new Error('useSnackbar needs a SnackbarProvider above it');
  }
  return api;
}

export function createSnackbarProvider(View: ComponentType<SnackbarViewProps>) {
  return function SnackbarProvider({ children }: { children: ReactNode }) {
    const { components } = useTheme();
    const [queue, setQueue] = useState<QueuedSnackbar[]>([]);
    const [paused, setPaused] = useState(false);
    const nextId = useRef(0);
    const current = queue[0];

    const api = useMemo<SnackbarApi>(
      () => ({
        show: (options) => {
          const snackbar = typeof options === 'string' ? { message: options } : options;
          nextId.current += 1;
          const remaining = snackbar.duration ?? components.snackbar.duration;
          setQueue((items) => [...items, { ...snackbar, id: nextId.current, remaining }]);
        },
        hide: () => setQueue((items) => items.slice(1)),
      }),
      [components.snackbar.duration]
    );

    useEffect(() => {
      if (!current || paused) {
        return;
      }
      const started = Date.now();
      const timer = setTimeout(() => setQueue((items) => items.filter((item) => item.id !== current.id)), current.remaining);
      return () => {
        clearTimeout(timer);
        current.remaining -= Date.now() - started;
      };
    }, [current, paused]);

    // A paused snackbar that goes away must not leave the next one paused
    useEffect(() => setPaused(false), [current?.id]);

    return (
      <SnackbarContext.Provider value={api}>
        {children}
        <View
          snackbar={current}
          onAction={() => {
            current?.action?.onPress();
            api.hide();
          }}
          onPause={() => setPaused(true)}
          onResume={() => setPaused(false)}
        />
      </SnackbarContext.Provider>
    );
  };
}
