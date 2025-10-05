import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize numeric values from APIs
 * Detects sentinel values (-999, -9999, etc.) and validates ranges
 */
export function sanitizeNumber(
  v: any,
  { min = -Infinity, max = Infinity }: { min?: number; max?: number } = {}
): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') {
    v = v.trim();
    if (v === '' || v.toLowerCase() === 'null') return null;
  }
  const n = Number(v);
  if (!isFinite(n)) return null;
  // Catch common sentinel values from NASA/weather APIs
  if (n === -999 || n === -9999 || n === -99999 || Math.abs(n) > 1e7) return null;
  if (n < min || n > max) return null;
  return n;
}

/**
 * AQI calculation using US EPA breakpoints
 */
const PM25_BREAKPOINTS = [
  { c_lo: 0.0, c_hi: 12.0, i_lo: 0, i_hi: 50 },
  { c_lo: 12.1, c_hi: 35.4, i_lo: 51, i_hi: 100 },
  { c_lo: 35.5, c_hi: 55.4, i_lo: 101, i_hi: 150 },
  { c_lo: 55.5, c_hi: 150.4, i_lo: 151, i_hi: 200 },
  { c_lo: 150.5, c_hi: 250.4, i_lo: 201, i_hi: 300 },
  { c_lo: 250.5, c_hi: 350.4, i_lo: 301, i_hi: 400 },
  { c_lo: 350.5, c_hi: 500.4, i_lo: 401, i_hi: 500 }
];

const PM10_BREAKPOINTS = [
  { c_lo: 0, c_hi: 54, i_lo: 0, i_hi: 50 },
  { c_lo: 55, c_hi: 154, i_lo: 51, i_hi: 100 },
  { c_lo: 155, c_hi: 254, i_lo: 101, i_hi: 150 },
  { c_lo: 255, c_hi: 354, i_lo: 151, i_hi: 200 },
  { c_lo: 355, c_hi: 424, i_lo: 201, i_hi: 300 },
  { c_lo: 425, c_hi: 504, i_lo: 301, i_hi: 400 },
  { c_lo: 505, c_hi: 604, i_lo: 401, i_hi: 500 }
];

function aqiFromBreakpoint(C: number | null, bp: typeof PM25_BREAKPOINTS): number | null {
  if (C === null) return null;
  for (const b of bp) {
    if (C >= b.c_lo && C <= b.c_hi) {
      const I = Math.round(((b.i_hi - b.i_lo) / (b.c_hi - b.c_lo)) * (C - b.c_lo) + b.i_lo);
      return I;
    }
  }
  return null;
}

export function computeAQI(pm25: number | null, pm10: number | null): {
  aqi: number | null;
  mainPollutant: string | null;
} {
  const aqiPm25 = aqiFromBreakpoint(pm25, PM25_BREAKPOINTS);
  const aqiPm10 = aqiFromBreakpoint(pm10, PM10_BREAKPOINTS);
  const candidates = [aqiPm25, aqiPm10].filter(x => x !== null) as number[];
  if (candidates.length === 0) return { aqi: null, mainPollutant: null };
  const highest = Math.max(...candidates);
  const main = (highest === aqiPm25) ? 'PM2.5' : 'PM10';
  return { aqi: highest, mainPollutant: main };
}
