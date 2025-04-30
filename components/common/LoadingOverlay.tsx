import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  visible, 
  message = 'Loading...' 
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
          <Text style={[styles.message, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});