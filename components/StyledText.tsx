import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

export function InterText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'inter-regular' }]} />;
}
