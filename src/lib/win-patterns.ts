import { SlotIconType } from '@/types/app';

export const WINNING_PATTERNS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Column 1
  [1, 4, 7], // Column 2
  [2, 5, 8], // Column 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

// Visualize pattern types for UI paths
export enum WinPatternType {
  ROW_1 = 'row1',
  ROW_2 = 'row2',
  ROW_3 = 'row3',
  DIAGONAL_1 = 'diag1', // top-left to bottom-right
  DIAGONAL_2 = 'diag2', // top-right to bottom-left
  SPECIAL = 'special',
}

// Icon multipliers for winning combinations
export const ICON_MULTIPLIERS: Record<SlotIconType, number> = {
  [SlotIconType.MEAT]: 1.2, // 1-1-1 x1.2
  [SlotIconType.CROCODILE]: 1.2, // 2-2-2 x1.2
  [SlotIconType.HEAD]: 2, // 3-3-3 x2
  [SlotIconType.TRUMP]: 3, // 4-4-4 x3
  [SlotIconType.AFEL]: 5, // 5-5-5 x5
  [SlotIconType.SOLANA]: 10, // 6-6-6 x10
};
// Special combinations with their multipliers
export const SPECIAL_COMBINATIONS = [
  {
    combo: [SlotIconType.MEAT, SlotIconType.CROCODILE, SlotIconType.CROCODILE],
    multiplier: 1.5, // 1-2-2 x1.5
    pattern: [0, 1, 2],
  },
  {
    combo: [SlotIconType.HEAD, SlotIconType.TRUMP, SlotIconType.HEAD],
    multiplier: 2.5, // 3-4-3 x2.5
    pattern: [3, 4, 5],
  },
  {
    combo: [SlotIconType.CROCODILE, SlotIconType.AFEL, SlotIconType.SOLANA],
    multiplier: 3, // 2-5-6 x3
    pattern: [6, 7, 8],
  },
  {
    combo: [SlotIconType.TRUMP, SlotIconType.AFEL, SlotIconType.SOLANA],
    multiplier: 4, // 4-5-6 x4
    pattern: [0, 4, 8],
  },
];
export interface WinPathData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  pathType: WinPatternType;
}

// Get the win pattern type from the pattern indices
export function getWinPatternType(pattern: number[]): WinPatternType {
  if (pattern[0] === 0 && pattern[1] === 1 && pattern[2] === 2)
    return WinPatternType.ROW_1;
  if (pattern[0] === 3 && pattern[1] === 4 && pattern[2] === 5)
    return WinPatternType.ROW_2;
  if (pattern[0] === 6 && pattern[1] === 7 && pattern[2] === 8)
    return WinPatternType.ROW_3;
  if (pattern[0] === 0 && pattern[1] === 3 && pattern[2] === 6)
    return WinPatternType.DIAGONAL_1;
  if (pattern[0] === 2 && pattern[1] === 4 && pattern[2] === 6)
    return WinPatternType.DIAGONAL_2;
  return WinPatternType.SPECIAL;
}

export function calculateWinningLinePath(
  pattern: number[],
  containerWidth: number,
  containerHeight: number
): WinPathData {
  const reelWidth = containerWidth / 3;
  const slotHeight = containerHeight / 3;
  const patternType = getWinPatternType(pattern);

  // Calculate points for each position in the pattern
  const points = pattern.map((slotIndex) => {
    const row = Math.floor(slotIndex / 3);
    const col = slotIndex % 3;

    return {
      x: col * reelWidth + reelWidth / 2,
      y: row * slotHeight + slotHeight / 2,
    };
  });

  // Create path data based on pattern type
  switch (patternType) {
    // Row 1 (top) - Create a curved path matching the design
    case WinPatternType.ROW_1:
      return {
        startX: -10, // Start slightly outside container for cleaner look
        startY: points[0].y,
        endX: containerWidth + 10, // End slightly outside container
        endY: points[2].y,
        controlX1: points[0].x + reelWidth / 2,
        controlY1: points[0].y - slotHeight / 3, // Curve upward
        controlX2: points[2].x - reelWidth / 2,
        controlY2: points[2].y - slotHeight / 3, // Curve upward
        pathType: patternType,
      };

    // Row 2 (middle) - More subtle curve
    case WinPatternType.ROW_2:
      return {
        startX: -10,
        startY: points[0].y,
        endX: containerWidth + 10,
        endY: points[2].y,
        controlX1: points[0].x + reelWidth,
        controlY1: points[0].y + slotHeight / 8, // Slight curve
        controlX2: points[2].x - reelWidth,
        controlY2: points[2].y - slotHeight / 8, // Slight curve
        pathType: patternType,
      };

    // Row 3 (bottom) - Curve matching design
    case WinPatternType.ROW_3:
      return {
        startX: -10,
        startY: points[0].y,
        endX: containerWidth + 10,
        endY: points[2].y,
        controlX1: points[0].x + reelWidth / 2,
        controlY1: points[0].y + slotHeight / 3, // Curve downward
        controlX2: points[2].x - reelWidth / 2,
        controlY2: points[2].y + slotHeight / 3, // Curve downward
        pathType: patternType,
      };

    // Diagonal from top-left to bottom-right
    case WinPatternType.DIAGONAL_1:
      return {
        startX: -10,
        startY: -10,
        endX: containerWidth + 10,
        endY: containerHeight + 10,
        controlX1: points[1].x - reelWidth / 4,
        controlY1: points[1].y - slotHeight / 4,
        controlX2: points[1].x + reelWidth / 4,
        controlY2: points[1].y + slotHeight / 4,
        pathType: patternType,
      };

    // Diagonal from top-right to bottom-left
    case WinPatternType.DIAGONAL_2:
      return {
        startX: containerWidth + 10,
        startY: -10,
        endX: -10,
        endY: containerHeight + 10,
        controlX1: points[1].x + reelWidth / 4,
        controlY1: points[1].y - slotHeight / 4,
        controlX2: points[1].x - reelWidth / 4,
        controlY2: points[1].y + slotHeight / 4,
        pathType: patternType,
      };

    // Special combination
    default:
      return {
        startX: points[0].x,
        startY: points[0].y,
        endX: points[2].x,
        endY: points[2].y,
        controlX1: points[1].x,
        controlY1: points[1].y - slotHeight / 3,
        controlX2: points[1].x,
        controlY2: points[1].y + slotHeight / 3,
        pathType: WinPatternType.SPECIAL,
      };
  }
}

// Helper functions for win calculations
export function isFullMatch(pattern: SlotIconType[]): boolean {
  return pattern[0] === pattern[1] && pattern[1] === pattern[2];
}

export function checkSpecialCombination(
  pattern: SlotIconType[]
): number | null {
  for (const { combo, multiplier } of SPECIAL_COMBINATIONS) {
    if (
      pattern[0] === combo[0] &&
      pattern[1] === combo[1] &&
      pattern[2] === combo[2]
    ) {
      return multiplier;
    }
  }
  return null;
}
