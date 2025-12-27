import { useEffect, useState } from "react";
import Key from "./lib/components/key";
import NoiseOverlay from "./lib/components/noise-overlay";

function App() {
  const [a, seta] = useState(false);

  useEffect(() => {
    const t = () => seta((p) => !p);

    const i = setInterval(() => {
      t();
    }, 1000);
    return clearInterval(i);
  }, []);
  return (
    <div className="relative min-h-screen w-full">
      <NoiseOverlay />
      <div className="h-screen flex items-center justify-center gap-24">
        <Key pressedState={[a, seta]}>a</Key>
        <Key>d</Key>
      </div>
    </div>
  );
}

export default App;
