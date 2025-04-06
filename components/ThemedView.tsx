import { View, ViewProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function ThemedView({ style, ...props }: ViewProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[{ backgroundColor: colors.background }, style]} {...props} />
  );
}
