import * as React from 'react';
import { SVGProps, memo } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 63 62"
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M12.923.04h37.152v6.192H12.923V.04ZM6.731 12.424V6.232h6.192v6.192H6.731Zm0 37.152V12.424H.54v37.152h6.192Zm6.192 6.192v-6.192H6.731v6.192h6.192Zm37.152 0v6.192H12.923v-6.192h37.152Zm6.192-6.192v6.192h-6.192v-6.192h6.192Zm0-37.152h6.192v37.152h-6.192V12.424Zm0 0V6.232h-6.192v6.192h6.192ZM28.403 9.328h6.192v6.192h9.288v6.192H25.307v6.192h18.576V46.48h-9.288v6.192h-6.192V46.48h-9.288v-6.192h18.576v-6.192H19.115V15.52h9.288V9.328Z"
    />
  </svg>
);
const WinIcon = memo(SvgComponent);
export default WinIcon;
