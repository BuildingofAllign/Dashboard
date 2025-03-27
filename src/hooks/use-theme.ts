
import { useData } from '@/context/DataContext';

export const useTheme = () => {
  const { theme, toggleTheme } = useData();
  
  return {
    theme,
    toggleTheme,
    isDarkMode: theme === 'dark'
  };
};
