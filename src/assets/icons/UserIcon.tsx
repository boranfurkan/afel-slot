import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={14}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M6 7a3.494 3.494 0 0 1-3.5-3.5C2.5 1.594 4.063 0 6 0c1.906 0 3.5 1.594 3.5 3.5C9.5 5.438 7.906 7 6 7Zm2.375 1c2 0 3.625 1.625 3.625 3.625v.875a1.5 1.5 0 0 1-1.5 1.5h-9A1.48 1.48 0 0 1 0 12.5v-.875C0 9.625 1.594 8 3.594 8h.25A4.97 4.97 0 0 0 6 8.5c.75 0 1.469-.188 2.125-.5h.25ZM15 7a3 3 0 1 1 .002-6.002A3 3 0 0 1 15 7Zm1.5 1c1.906 0 3.5 1.594 3.5 3.5a1.5 1.5 0 0 1-1.5 1.5h-5.531c0-.063.031-.125.031-.188v-1.187c0-1.219-.5-2.313-1.25-3.125.5-.313 1.094-.5 1.75-.5h.094c.437.156.906.25 1.406.25.469 0 .938-.094 1.375-.25h.125Z"
    />
  </svg>
);
const UserIcon = memo(SvgComponent);
export default UserIcon;
