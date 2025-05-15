import React, { useMemo, memo } from 'react';

interface RowIndicatorProps {
  side: 'left' | 'right';
  containerHeight: string;
}

const RowIndicator: React.FC<RowIndicatorProps> = ({
  side,
  containerHeight,
}) => {
  const rowPositions = useMemo(() => {
    const heightValue = parseInt(containerHeight.replace('px', ''));
    const rowHeight = (heightValue + 50) / 3;

    return [
      rowHeight / 2, // row 1 center
      rowHeight + rowHeight / 2, // row 2 center
      2 * rowHeight + rowHeight / 2, // row 3 center
    ];
  }, [containerHeight]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{ height: containerHeight }}
    >
      {[1, 2, 3].map((rowNumber, index) => (
        <div
          key={`row-indicator-${side}-${rowNumber}`}
          className="absolute w-10 h-10 rounded-full bg-[#4DFF00] flex items-center justify-center text-xl font-bold text-black"
          style={{
            top: `${rowPositions[index]}px`,
            [side === 'left' ? 'left' : 'right']: '-20px',
            transform: 'translateY(-50%)',
          }}
        >
          {rowNumber}
        </div>
      ))}
    </div>
  );
};

export default memo(RowIndicator);
