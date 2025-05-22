import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts Lamports to SOL
 * @param lamports - The amount in Lamports to convert
 * @param fixedDecimals - Number of decimal places to fix the result (default: 9)
 * @returns The equivalent value in SOL as a string with fixed decimal places
 */
export function lamportsToSol(
  lamports: number | bigint,
  fixedDecimals: number = 9
): string {
  const lamportsNum =
    typeof lamports === "bigint" ? Number(lamports) : lamports;

  const sol = lamportsNum / 1_000_000_000;

  return sol.toFixed(fixedDecimals);
}

/**
 * Converts SOL to Lamports
 * @param sol - The amount in SOL to convert
 * @returns The equivalent value in Lamports as a number
 */
export function solToLamports(sol: number | string): number {
  const solNum = typeof sol === "string" ? parseFloat(sol) : sol;

  return Math.floor(solNum * 1_000_000_000);
}

/**
 *
 * @returns A unique reference ID required for the API requests
 */
export const getReferenceId = () => uuidv4();
