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
      d="M20.375 7.535V9.96H.985V7.535h2.423V5.112h3.636V2.688h2.424V.264h2.424v2.424h2.423v2.424h3.636v2.423h2.424Z"
    />
  </svg>
);

const ArrowUpIcon = memo(SvgComponent);
export default ArrowUpIcon;
