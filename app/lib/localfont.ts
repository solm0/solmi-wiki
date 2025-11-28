import localFont from 'next/font/local'

export const pretendard = localFont({
  src: [
    {
      path: '../fonts/pretendard-variable.woff2',
      weight: '400',
      style: 'regular',
    },
    {
      path: '../fonts/pretendard-variable.woff2',
      weight: '500',
      style: 'medium',
    }
  ],
  variable: '--font-pretendard',
})

export const maruburi = localFont({
  src: [
    {
      path: '../fonts/maruburi-semibold.otf',
      style: 'semibold',
    },
  ],
  variable: '--font-maruburi',
})

export const maruburi_bold = localFont({
  src: [
    {
      path: '../fonts/maruburi-bold.otf',
      style: 'bold',
    },
  ],
  variable: '--font-maruburi-bold'
})