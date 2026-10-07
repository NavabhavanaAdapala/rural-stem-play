import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

const OfflineBanner = () => {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (!offline) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] flex items-center justify-center gap-2 bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground">
      <WifiOff className="h-4 w-4" /> You are offline. Saved pages still work — your progress will sync when you reconnect.
    </div>
  );
};

export default OfflineBanner;
