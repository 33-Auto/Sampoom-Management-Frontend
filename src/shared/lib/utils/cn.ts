import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 *
 * @param tailwindCSS..
 * @returns megerged-tailwindCSS
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
