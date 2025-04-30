import * as React from 'react';
import { SVGProps, memo } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 47"
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M6.491 46.199H.758V.332H6.49v5.733h5.734v8.6h5.733V20.4h5.733v5.733h-5.733v5.733h-5.733v8.6H6.49V46.2Z"
    />
  </svg>
);

const ArrowRightIcon = memo(SvgComponent);
export default ArrowRightIcon;
