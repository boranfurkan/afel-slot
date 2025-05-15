import React from 'react';

interface RowIndicatorProps {
  side: 'left' | 'right';
  containerHeight: string;
}

const RowIndicator: React.FC<RowIndicatorProps> = ({
  side,
  containerHeight,
}) => {
  // Parse the container height (remove 'px' if present)
  const heightValue = parseInt(containerHeight.replace('px', ''));

  // Calculate row heights based on containerHeight (3 equal rows)
  const rowHeight = (heightValue + 50) / 3;

  // Calculate center positions for each row
  const row1Center = rowHeight / 2;
  const row2Center = rowHeight + rowHeight / 2;
  const row3Center = 2 * rowHeight + rowHeight / 2;

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{ height: containerHeight }}
    >
      {/* Row 1 (top) */}
      <div
        className="absolute w-10 h-10 rounded-full bg-[#4DFF00] flex items-center justify-center text-xl font-bold text-black"
        style={{
          top: `${row1Center}px`,
          [side === 'left' ? 'left' : 'right']: '-20px',
          transform: 'translateY(-50%)',
        }}
      >
        1
      </div>

      {/* Row 2 (middle) */}
      <div
        className="absolute w-10 h-10 rounded-full bg-[#4DFF00] flex items-center justify-center text-xl font-bold text-black"
        style={{
          top: `${row2Center}px`,
          [side === 'left' ? 'left' : 'right']: '-20px',
          transform: 'translateY(-50%)',
        }}
      >
        2
      </div>

      {/* Row 3 (bottom) */}
      <div
        className="absolute w-10 h-10 rounded-full bg-[#4DFF00] flex items-center justify-center text-xl font-bold text-black"
        style={{
          top: `${row3Center}px`,
          [side === 'left' ? 'left' : 'right']: '-20px',
          transform: 'translateY(-50%)',
        }}
      >
        3
      </div>
    </div>
  );
};

export default RowIndicator;
