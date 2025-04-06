import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemedTextProps extends TextProps {
  type?: 'body' | 'title' | 'subtitle' | 'link';
}

export function ThemedText({ type = 'body', style, ...props }: ThemedTextProps) {
  const { colors } = useTheme();
  
  let textStyle = styles.body;
  
  switch (type) {
    case 'title':
      textStyle = styles.title;
      break;
    case 'subtitle':
      textStyle = styles.subtitle;
      break;
    case 'link':
      textStyle = styles.link;
      break;
  }
  
  return (
    <Text style={[textStyle, { color: colors.text }, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  link: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
