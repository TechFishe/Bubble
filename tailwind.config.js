/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      dropShadow: {
        'navBtn': '0 3px 2px rgba(201, 225, 226, 0.175)',
        'basicBtn': '0 2px 1px rgba(201, 225, 226, 0.15)'
      },
      height: {
        'fullscreen': 'calc(100vh - 6rem)'
      },
      minHeight: {
        'fullscreen': 'calc(100vh - 6rem)'
      },
      maxHeight: {
        'fullscreen': 'calc(100vh - 6rem)',
        'chatView': 'calc(100vh - 14rem)'
      },
      colors: {
        'snow': '#FFF9F9',
        'aero': {
          '50': '#eafff4',
          '100': '#c9ffe2', //Default
          '200': '#9efccf',
          '300': '#5ff6b6',
          '400': '#21e699',
          '500': '#00ce83',
          '600': '#00a86c',
          '700': '#00865a',
          '800': '#006a48',
          '900': '#00573d',
          '950': '#003124',
        },
        'shark': {
          '50': '#f8f7f8',
          '100': '#f0eeef',
          '200': '#dddadc',
          '300': '#bfbabd',
          '400': '#9c9498',
          '500': '#80777c',
          '600': '#686165',
          '700': '#554f52',
          '800': '#494346',
          '900': '#3f3b3e',
          '950': '#201e1f', //Default
        },          
      }
    },
  },
  plugins: [],
}

