import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function VerifyEmail() {
  const { colors } = useTheme();
  const params = useSearchParams();
  const email = params.email as string;
  
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputs = Array(6).fill(0).map(() => React.createRef<TextInput>());

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste of the entire OTP
      const otpArray = text.slice(0, 6).split('').map(char => char);
      setOtp([...otpArray, ...Array(6 - otpArray.length).fill('')]);
      
      // Focus on the last filled input or the next empty input
      const lastIndex = Math.min(otpArray.length, 5);
      inputs[lastIndex].current?.focus();
    } else {
      // Handle single digit input
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Auto-focus on next input
      if (text && index < 5) {
        inputs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input when backspace is pressed on an empty input
      inputs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    setError(null);
    setIsLoading(true);

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/verification/email/verify-otp', {
        email,
        otp: otpValue,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.replace('/(auth)');
        }, 2000);
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    setError(null);
    
    try {
      const response = await api.post('/api/verification/email/send-otp', { email });
      
      if (response.success) {
        setCountdown(60); // 60-second countdown
      } else {
        setError(response.message || 'Failed to resend verification code');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            Verify Email
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
            We've sent a verification code to
          </Text>
          <Text style={[styles.email, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            {email}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputs[index] as any}
                style={[
                  styles.otpInput,
                  {
                    borderColor: error ? colors.error : colors.border,
                    color: colors.text,
                    backgroundColor: colors.background,
                  },
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? 6 : 1} // Allow paste on first input
                selectTextOnFocus
              />
            ))}
          </View>

          {error && (
            <Text style={[styles.errorText, { color: colors.error, fontFamily: 'DMSans_400Regular' }]}>
              {error}
            </Text>
          )}

          {success && (
            <Text style={[styles.successText, { color: colors.success, fontFamily: 'DMSans_400Regular' }]}>
              Email verification successful! Redirecting...
            </Text>
          )}

          <Button
            title="Verify Email"
            onPress={handleVerify}
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            style={{ marginTop: 24 }}
          />

          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={countdown > 0 || resending}
            >
              <Text
                style={[
                  styles.resendButton,
                  {
                    color: countdown > 0 || resending ? colors.textLight : colors.primary,
                    fontFamily: 'DMSans_700Bold',
                  },
                ]}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
  },
  resendButton: {
    fontSize: 14,
  },
});