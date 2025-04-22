import localFont from 'next/font/local';

export const freePixelFont = localFont({
  src: [
    {
      path: './FreePixel.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-free-pixel',
  display: 'swap',
});

export const supplyMediumFont = localFont({
  src: [
    {
      path: './SupplyMedium.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-supply-medium',
  display: 'swap',
  style: 'normal',
  weight: '400',
});
