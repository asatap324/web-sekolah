import { useMemo } from "react";

export function useGreeting() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Selamat Pagi";
    } else if (hour >= 12 && hour < 18) {
      return "Selamat Siang";
    } else {
      return "Selamat Malam";
    }
  }, []);

  return greeting;
}
