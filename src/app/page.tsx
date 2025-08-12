'use client';

import { useEffect, useState } from 'react';
import Toolbar from "@/components/Toolbar";
import TrackList from "@/components/TrackList";
import KeyboardHandler from "@/components/KeyboardHandler";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="app">
      <main className="app-main">
        <KeyboardHandler />
        <Toolbar />
        <TrackList />
      </main>
    </div>
  );
}
