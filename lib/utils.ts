import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGreeting = () => {
  const currentHour = new Date().getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour <= 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return greeting;
};
