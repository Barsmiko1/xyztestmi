import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Lock } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const { colors, isDark } = useTheme();
  const { signIn, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (values: { usernameOrEmail: string; password: string }) => {
    try {
      setLoginError(null);
      const success = await signIn(values.usernameOrEmail, values.password);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        setLoginError('Invalid username/email or password');
      }
    } catch (error: any) {
      // Handle specific error messages from the API
      if (error.errorCode === 'NETWORK_ERROR' || error.errorCode === 'TIMEOUT_ERROR') {
        setLoginError(error.message);
      } else {
        setLoginError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/200x60?text=Papay+Moni' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              Log in to your Papay Moni account
            </Text>
          </View>

          {loginError && (
            <View style={[styles.errorContainer, { backgroundColor: isDark ? colors.error + '20' : colors.error + '10' }]}>
              <Text style={[styles.errorText, { color: colors.error, fontFamily: 'DMSans_400Regular' }]}>
                {loginError}
              </Text>
            </View>
          )}

          <Formik
            initialValues={{ usernameOrEmail: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <Input
                  label="Username or Email"
                  placeholder="Enter your username or email"
                  value={values.usernameOrEmail}
                  onChangeText={handleChange('usernameOrEmail')}
                  onBlur={handleBlur('usernameOrEmail')}
                  error={touched.usernameOrEmail && errors.usernameOrEmail ? errors.usernameOrEmail : undefined}
                  leftIcon={<User size={20} color={colors.textLight} />}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
                  leftIcon={<Lock size={20} color={colors.textLight} />}
                  secureTextEntry={true}
                  showPasswordToggle={true}
                />

                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forgot-password')}
                  style={styles.forgotPassword}
                >
                  <Text
                    style={[
                      styles.forgotPasswordText,
                      { color: colors.primary, fontFamily: 'DMSans_500Medium' },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Log In"
                  onPress={() => handleSubmit()}
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  style={{ marginTop: 16 }}
                />
              </View>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.signupText, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 60,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  signupText: {
    fontSize: 14,
  },
});