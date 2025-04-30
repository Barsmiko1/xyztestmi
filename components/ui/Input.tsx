import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderRightAccessory = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity 
          onPress={togglePasswordVisibility} 
          style={styles.iconContainer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPasswordVisible ? (
            <EyeOff size={20} color={colors.text} />
          ) : (
            <Eye size={20} color={colors.text} />
          )}
        </TouchableOpacity>
      );
    }
    
    if (rightIcon) {
      return <View style={styles.iconContainer}>{rightIcon}</View>;
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.text, fontFamily: 'DMSans_500Medium' },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: isDark ? colors.gray[800] : colors.background,
          },
          error && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: 'DMSans_400Regular',
              paddingLeft: leftIcon ? 8 : 16,
              paddingRight: rightIcon || showPasswordToggle ? 8 : 16,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.textLight}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          selectionColor={colors.primary}
          {...props}
        />
        {renderRightAccessory()}
      </View>
      {error && (
        <Text
          style={[
            styles.errorText,
            { color: colors.error, fontFamily: 'DMSans_400Regular' },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputError: {
    borderWidth: 1,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});