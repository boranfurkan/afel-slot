import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M9.161.892c.203 0 .395.016.576.048.182.032.33.133.448.304.128.17.192.464.192.88 0 .405-.064.699-.192.88a.683.683 0 0 1-.464.304 3.313 3.313 0 0 1-.576.048H6.937v7.328c0 .235-.021.464-.064.688a.825.825 0 0 1-.368.528c-.192.139-.533.208-1.024.208-.47 0-.805-.07-1.008-.208a.884.884 0 0 1-.368-.544 4.86 4.86 0 0 1-.048-.688V3.356H1.833c-.192 0-.384-.016-.576-.048a.805.805 0 0 1-.464-.32c-.117-.17-.176-.464-.176-.88 0-.405.059-.693.176-.864a.739.739 0 0 1 .48-.304c.192-.032.384-.048.576-.048h7.312Z"
    />
  </svg>
);

const TailIcon = memo(SvgComponent);
export default TailIcon;
