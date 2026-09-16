import { useState, useEffect } from "react";

export const useLiveClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      try {
        setTime(now.toLocaleTimeString("en-US", options) + " IST");
      } catch {
        setTime(now.toLocaleTimeString() + " IST");
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};
