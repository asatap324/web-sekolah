import { useMemo } from "react";

export function useGreeting() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }, []);

  return greeting;
}
