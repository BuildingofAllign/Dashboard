
import { useTheme as useThemeFromContext } from '@/components/ui/ThemeProvider';

export const useTheme = () => {
  return useThemeFromContext();
};
