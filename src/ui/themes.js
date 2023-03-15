import { createTheme, adaptV4Theme } from '@mui/material/styles';

const commonTheme = {
}

// easy mode is either on or off
const defaultMode = {
  easyMode: false,
}
const easyMode = {
  easyMode: true,
  transitions: {
    create: () => 'none',
  },
	overrides: {
		// Name of the component 
		MuiCssBaseline: {
			// Name of the rule
			'@global': {
				'*, *::before, *::after': {
					transition: 'none !important',
					animation: 'none !important',
				},
			},
		},
	},
}
// palette is either 'dark' or 'light'
const lightTheme = {palette: {type: 'light'}}
const darkTheme = {palette: {type: 'dark'}}

export default [
  {
    theme: createTheme(adaptV4Theme({...commonTheme, ...lightTheme, ...defaultMode})),
    name: "Light Theme",
    description: "Default theme, full animations",
  },
  {
    theme: createTheme(adaptV4Theme({...commonTheme, ...darkTheme, ...defaultMode})),
    name: "Dark Theme",
    description: 'Dark theme ("Dark Mode"), full animations',
  },
  {
    theme: createTheme(adaptV4Theme({...commonTheme, ...lightTheme, ...easyMode})),
    name: "Easy Light Theme",
    description: "Default theme, friendly for slower browsers",
  },
  {
    theme: createTheme(adaptV4Theme({...commonTheme, ...darkTheme, ...easyMode})),
    name: "Easy Dark Theme",
    description: 'Dark theme ("Dark Mode"), friendly for slower browsers',
  },
]
