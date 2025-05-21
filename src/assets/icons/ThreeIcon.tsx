import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={48}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M.969 38.17h4.61v4.611H.97v-4.61ZM5.579.627h18.772v4.72h4.72v9.331h-4.72v4.72h-4.72v4.721h4.72v4.61h4.72v9.441h-4.72v4.611h-4.72v4.72H5.579v-4.72h14.052v-4.61h4.72V28.73h-4.72v-4.61H10.3v-4.721h9.33v-4.72h4.721V5.348H5.579V.628Zm0 4.72v4.72H.97v-4.72h4.61Z"
    />
  </svg>
);
const ThreeIcon = memo(SvgComponent);
export default ThreeIcon;
