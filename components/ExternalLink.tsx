import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await WebBrowser.openBrowserAsync(href);
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {children}
    </TouchableOpacity>
  );
}
