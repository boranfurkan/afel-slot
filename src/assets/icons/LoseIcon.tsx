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
      d="M.5 0h8.857v8.857H.5V0Zm17.714 17.714H9.357V8.857h8.857v8.857Zm8.857 8.857h-8.857v-8.857h8.857v8.857Zm8.858 0H27.07v8.858h-8.857v8.857H9.357v8.857H.5V62h8.857v-8.857h8.857v-8.857h8.857v-8.857h8.858v8.857h8.857v8.857h8.857V62H62.5v-8.857h-8.857v-8.857h-8.857v-8.857h-8.857V26.57Zm8.857-8.857v8.857h-8.857v-8.857h8.857Zm8.857-8.857v8.857h-8.857V8.857h8.857Zm0 0V0H62.5v8.857h-8.857Z"
    />
  </svg>
);

const LoseIcon = memo(SvgComponent);
export default LoseIcon;
