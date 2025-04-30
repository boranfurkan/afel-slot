import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="#A0C380"
      d="M11.758 11.758H9.055v2.703h2.703v-2.703ZM11.758 6.35H9.055v2.704h2.703V6.35ZM9.078 6.35h2.703V.943H9.077V6.35ZM.953 9.054v2.704h5.408V9.054H.953Z"
    />
    <path
      fill="#A0C380"
      d="M9.078 19.869h2.703V14.46H9.077v5.408ZM6.367 9.054v2.704h2.704V9.054H6.367ZM11.781 9.054v2.704h2.704V9.054h-2.704Z"
    />
    <path fill="#A0C380" d="M14.469 9.054v2.704h5.407V9.054H14.47Z" />
  </svg>
);

const PlusIcon = memo(SvgComponent);
export default PlusIcon;
