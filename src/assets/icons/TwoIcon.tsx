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
      d="M5.58.97H24.35v4.72h4.72v14.052h-4.72v4.72h-4.72v4.61H15.02v4.721H10.3v4.72H5.58v4.61H29.07v4.721H.97v-9.33h4.61v-4.721h4.72v-4.72h4.721v-4.61h4.61v-4.721h4.721V5.69H5.579V.97Zm0 4.72v9.331H.968v-9.33h4.61Z"
    />
  </svg>
);

const TwoIcon = memo(SvgComponent);
export default TwoIcon;
