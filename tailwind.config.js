const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // primary: '#F8F3EB',
        // secondary: '#FC7E2F',
        // accent: '#F40552',
  
         // Primary
          'magenta-050': '#F5E1F7',
          'magenta-100': '#ECBDF2',
          'magenta-200': '#CE80D9',
          'magenta-300': '#BB61C7',
          'magenta-400': '#AD4BB8',
          'magenta-500': '#A23DAD',
          'magenta-600': '#90279C',
          'magenta-700': '#7C1A87',
          'magenta-800': '#671270',
          'magenta-900': '#4E0754', 
  
          'orange-vivid-050': '#FFE8D9',
          'orange-vivid-100': '#FFD0B5',
          'orange-vivid-200': '#FFB088',
          'orange-vivid-300': '#FF9466',
          'orange-vivid-400': '#F9703E',
          'orange-vivid-500': '#F35627',
          'orange-vivid-600': '#DE3A11',
          'orange-vivid-700': '#C52707',
          'orange-vivid-800': '#AD1D07',
          'orange-vivid-900': '#841003',
  
          // Neutrals
          'blue-gray-050': '#F0F4F8',
          'blue-gray-100': '#D9E2EC',
          'blue-gray-200': '#BCCCDC',
          'blue-gray-300': '#9FB3C8',
          'blue-gray-400': '#829AB1',
          'blue-gray-500': '#627D98',
          'blue-gray-600': '#486581',
          'blue-gray-700': '#334E68',
          'blue-gray-800': '#243B53',
          'blue-gray-900': '#102A43',
  
          // Supporting
          'yellow-vivid-050': '#FFFBEA',
          'yellow-vivid-100': '#FFF3C4',
          'yellow-vivid-200': '#FCE588',
          'yellow-vivid-300': '#FADB5F',
          'yellow-vivid-400': '#F7C948',
          'yellow-vivid-500': '#F0B429',
          'yellow-vivid-600': '#DE911D',
          'yellow-vivid-700': '#CB6E17',
          'yellow-vivid-800': '#B44D12',
          'yellow-vivid-900': '#8D2B0B',
  
          'red-vivid-050': '#FFE3E3',
          'red-vivid-100': '#FFBDBD',
          'red-vivid-200': '#FF9B9B',
          'red-vivid-300': '#F86A6A',
          'red-vivid-400': '#EF4E4E',
          'red-vivid-500': '#E12D39',
          'red-vivid-600': '#CF1124',
          'red-vivid-700': '#AB091E',
          'red-vivid-800': '#8A041A',
          'red-vivid-900': '#610316',
  
          'green-vivid-050': '#E3F9E5',
          'green-vivid-100': '#C1F2C7',
          'green-vivid-200': '#91E697',
          'green-vivid-300': '#51CA58',
          'green-vivid-400': '#31B237',
          'green-vivid-500': '#18981D',
          'green-vivid-600': '#0F8613',
          'green-vivid-700': '#0E7817',
          'green-vivid-800': '#07600E',
          'green-vivid-900': '#014807',
      },
      fontFamily: {
        ...fontFamily,
        sans: ['Nunito', 'sans'],
      },
      keyframes: {
        glitch: {
          '0%': { 
            transform: 'translate3d(-10px,0px,0px) scale3d(-1,-1,1)',
            'clip-path': 'polygon(0 20%, 100% 20%, 100% 21%, 0 21%)'
          },
          '2%': {
              'clip-path': 'polygon(0 33%, 100% 33%, 100% 33%, 0 33%)'
          },
          '4%': {
              'clip-path': 'polygon(0 44%, 100% 44%, 100% 44%, 0 44%)'
          },
          '5%': {
              'clip-path': 'polygon(0 50%, 100% 50%, 100% 20%, 0 20%)'
          },
          '6%': {
              'clip-path': 'polygon(0 70%, 100% 70%, 100% 70%, 0 70%)'
          },
          '7%': {
              'clip-path': 'polygon(0 80%, 100% 80%, 100% 80%, 0 80%)'
          },
          '8%': {
              'clip-path': 'polygon(0 50%, 100% 50%, 100% 55%, 0 55%)'
          },
          '9.9%': {
              transform: 'translate3d(-10px,0px,0px) scale3d(-1,-1,1)',
              'clip-path': 'polygon(0 70%, 100% 70%, 100% 80%, 0 80%)'
          },
          '10%, 100%': {
              transform: 'translate3d(0,0,0) scale3d(1,1,1)',
              'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
          }
        }
      },
      animation: {
        'glitch': 'glitch 1s',
        'glitch-reverse' : 'glitch 3s reverse'
       }
    },
  },
  variants: {
    extend: {
      // backgroundColor: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
