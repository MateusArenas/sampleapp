

import React from 'react';
import { GestureResponderEvent, TouchableHighlight, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import AwesomeCardAvatar from './AwesomeCardAvatar';
import AwesomeCardContent from './AwesomeCardContent';
import AwesomeCardHeader from './AwesomeCardHeader';
import AwesomeCardCheckboxIcon from './AwesomeCardCheckboxIcon';
import AwesomeCardTitle from './AwesomeCardTitle';
import AwesomeCardStatus from './AwesomeCardStatus';
import AwesomeCardBody from './AwesomeCardBody';
import AwesomeCardLink from './AwesomeCardLink';
import AwesomeCardDescription from './AwesomeCardDescription';
import AwesomeCardRow from './AwesomeCardRow';
import AwesomeCardFooter from './AwesomeCardFooter';
import AwesomeCardActionIconButton from './AwesomeCardActionIconButton';

export interface AwesomeCardProps {
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  mode?: "normal" | "selected";
}

const AwesomeCard = ({
  mode,
  disabled,
  onPress,
  style,
  children,
}: AwesomeCardProps, ref: React.ForwardedRef<View>) => {
  const theme = useTheme();
  
  return (
    <TouchableHighlight
      underlayColor={theme.colors.elevation.level3}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card, 
        mode === "selected" && { backgroundColor: theme.colors.elevation.level5 },
        style
      ]}
    >
      <>
        {children}
      </>
    </TouchableHighlight>
  )
}

// @component ./AwesomeCardRow.tsx
AwesomeCard.Row = AwesomeCardRow;

// @component ./AwesomeCardCheckboxIcon.tsx
AwesomeCard.CheckboxIcon = AwesomeCardCheckboxIcon;

// @component ./AwesomeCardContent.tsx
AwesomeCard.Content = AwesomeCardContent;

// @component ./AwesomeCardAvatar.tsx
AwesomeCard.Avatar = AwesomeCardAvatar;

// @component ./AwesomeCardHeader.tsx
AwesomeCard.Header = AwesomeCardHeader;

// @component ./AwesomeCardTitle.tsx
AwesomeCard.Title = AwesomeCardTitle;

// @component ./AwesomeCardStatus.tsx
AwesomeCard.Status = AwesomeCardStatus;

// @component ./AwesomeCardBody.tsx
AwesomeCard.Body = AwesomeCardBody;

// @component ./AwesomeCardLink.tsx
AwesomeCard.Link = AwesomeCardLink;

// @component ./AwesomeCardDescription.tsx
AwesomeCard.Description = AwesomeCardDescription;

// @component ./AwesomeCardActionIconButton.tsx
AwesomeCard.ActionIconButton = AwesomeCardActionIconButton;

// @component ./AwesomeCardFooter.tsx
AwesomeCard.Footer = AwesomeCardFooter;


const styles = StyleSheet.create({
  card: {
    flexDirection: "row", 
    alignItems: "center",
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    gap: 12,
  }
});

export default AwesomeCard;