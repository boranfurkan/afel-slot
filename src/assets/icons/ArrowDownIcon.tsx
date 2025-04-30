import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 10"
    fill="none"
    {...props}
  >
    <path
      fill="#C8C8C8"
      d="M.984 2.448V.024h19.391v2.424h-2.424v2.424h-3.636v2.424h-2.423V9.72H9.468V7.296H7.044V4.872H3.408V2.448H.984Z"
    />
  </svg>
);

const ArrowDownIcon = memo(SvgComponent);
export default ArrowDownIcon;
