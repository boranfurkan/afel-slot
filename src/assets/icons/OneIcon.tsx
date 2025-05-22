import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={47}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M10.217.02h4.647v42.153h9.404v4.647H.812v-4.647h9.405V9.313H5.569v4.757H.813V9.313h4.756V4.666h4.648V.02Z"
    />
  </svg>
);

const OneIcon = memo(SvgComponent);
export default OneIcon;
