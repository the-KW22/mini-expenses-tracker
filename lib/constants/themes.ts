export const themes = [
  {
    id: 'sage',
    name: 'Sage',
    colors: {
      primary: '#A1C1A1',
      secondary: '#DFDAD3',
      accent: '#8BA995',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: {
      primary: '#E8B4B8',
      secondary: '#F5E6E8',
      accent: '#D4A5A5',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: {
      primary: '#B8A9C9',
      secondary: '#E8E4ED',
      accent: '#9D8BB0',
    },
  },
  {
    id: 'mint',
    name: 'Mint',
    colors: {
      primary: '#98D7C2',
      secondary: '#E3F4F0',
      accent: '#7FBFAB',
    },
  },
  {
    id: 'peach',
    name: 'Peach',
    colors: {
      primary: '#FFCBA4',
      secondary: '#FFF0E5',
      accent: '#E8A87C',
    },
  },
  {
    id: 'lemon',
    name: 'Lemon',
    colors: {
      primary: '#F0E68C',
      secondary: '#FFFACD',
      accent: '#DAC86B',
    },
  },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
