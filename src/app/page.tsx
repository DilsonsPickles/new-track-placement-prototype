import Toolbar from "@/components/Toolbar";
import TrackList from "@/components/TrackList";
import KeyboardHandler from "@/components/KeyboardHandler";

export default function Home() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Audacity Track Placement Prototype</h1>
        <p>
          Interactive testing for different track placement strategies. 
          Try different actions and see where new tracks appear!
        </p>
      </header>

      <main className="app-main">
        <KeyboardHandler />
        <Toolbar />
        <TrackList />
      </main>

      <footer className="app-footer">
        <p>
          This prototype helps solve the UX consistency problem in Audacity&apos;s track placement. 
          Test different strategies to find the most intuitive approach.
        </p>
      </footer>
    </div>
  );
}
