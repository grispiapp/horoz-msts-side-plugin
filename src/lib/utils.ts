import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

/**
 * "2026-11-06 16:28:57" -> "6 Kas 16:28" (year added when it isn't the current one)
 */
export function formatMstsDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/);

  if (!match) return value;

  const [, year, month, day, hour, minute] = match;
  const sameYear = Number(year) === new Date().getFullYear();
  const date = `${Number(day)} ${MONTHS[Number(month) - 1]}${sameYear ? "" : ` ${year}`}`;

  return hour ? `${date} ${hour}:${minute}` : date;
}
