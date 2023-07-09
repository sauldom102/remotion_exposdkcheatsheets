import {
	createContext,
	useState,
	useContext,
	FC,
	ReactNode,
	SetStateAction,
	Dispatch,
} from 'react';

// Define the theme type
type Theme = 'dark' | 'light';

// Create a context for the theme
const ThemeContext = createContext<{
	theme: Theme;
	setTheme: Dispatch<SetStateAction<Theme>>;
	isLight: boolean;
}>({
	theme: 'dark',
	setTheme: () => 'light',
	isLight: true,
});

export const ThemeProvider: FC<{children: ReactNode}> = ({children}) => {
	const [theme, setTheme] = useState<Theme>('dark');

	const isLight = theme === 'light';

	return (
		<ThemeContext.Provider value={{theme, setTheme, isLight}}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const values = useContext(ThemeContext);
	return values;
};
