
import { useTheme as useThemeFromProvider } from '@/components/ui/ThemeProvider';

export const useTheme = () => {
  return useThemeFromProvider();
};
