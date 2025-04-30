import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, User, Mail, Phone, Lock, Calendar, Users, CreditCard } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/lib/api';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phoneNumber: Yup.string()
    .matches(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +2347012345678)')
    .required('Phone number is required'),
  bvn: Yup.string()
    .matches(/^\d{11}$/, 'BVN must be 11 digits')
    .required('BVN is required'),
  dateOfBirth: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
    .required('Date of birth is required'),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Gender must be Male, Female, or Other')
    .required('Gender is required'),
  referralCode: Yup.string().optional(),
});

export default function Register() {
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async (values: any) => {
    setRegisterError(null);
    setIsLoading(true);

    try {
      // First, check if email is already registered
      const emailCheckResponse = await api.get(`/api/verification/email/status?email=${values.email}`);
      
      if (emailCheckResponse.success && emailCheckResponse.data === true) {
        setRegisterError('Email is already registered');
        setIsLoading(false);
        return;
      }

      // Register user
      const success = await signUp(values);
      
      if (success) {
        // Send verification email
        await api.post('/api/verification/email/send-otp', { email: values.email });
        
        // Navigate to verification page
        router.push({
          pathname: '/(auth)/verify',
          params: { email: values.email }
        });
      } else {
        setRegisterError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      setRegisterError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            Create Account
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.subtitle, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
            Fill in your details to create your Papay Moni account
          </Text>

          {registerError && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '10' }]}>
              <Text style={[styles.errorText, { color: colors.error, fontFamily: 'DMSans_400Regular' }]}>
                {registerError}
              </Text>
            </View>
          )}

          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
              bvn: '',
              dateOfBirth: '',
              gender: '',
              referralCode: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegistration}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  error={touched.username && errors.username ? errors.username : undefined}
                  leftIcon={<User size={20} color={colors.textLight} />}
                  autoCapitalize="none"
                />

                <Input
                  label="Email"
                  placeholder="Enter your email address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email ? errors.email : undefined}
                  leftIcon={<Mail size={20} color={colors.textLight} />}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Input
                  label="Password"
                  placeholder="Create a secure password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
                  leftIcon={<Lock size={20} color={colors.textLight} />}
                  secureTextEntry={true}
                  showPasswordToggle={true}
                />

                <View style={styles.nameContainer}>
                  <View style={styles.nameField}>
                    <Input
                      label="First Name"
                      placeholder="First name"
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                    />
                  </View>
                  <View style={styles.nameField}>
                    <Input
                      label="Last Name"
                      placeholder="Last name"
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                    />
                  </View>
                </View>

                <Input
                  label="Phone Number"
                  placeholder="e.g., +2347012345678"
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  error={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : undefined}
                  leftIcon={<Phone size={20} color={colors.textLight} />}
                  keyboardType="phone-pad"
                />

                <Input
                  label="BVN"
                  placeholder="Enter your 11-digit BVN"
                  value={values.bvn}
                  onChangeText={handleChange('bvn')}
                  onBlur={handleBlur('bvn')}
                  error={touched.bvn && errors.bvn ? errors.bvn : undefined}
                  leftIcon={<CreditCard size={20} color={colors.textLight} />}
                  keyboardType="number-pad"
                  maxLength={11}
                />

                <Input
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                  value={values.dateOfBirth}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  error={touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : undefined}
                  leftIcon={<Calendar size={20} color={colors.textLight} />}
                />

                <Input
                  label="Gender"
                  placeholder="Male, Female, or Other"
                  value={values.gender}
                  onChangeText={handleChange('gender')}
                  onBlur={handleBlur('gender')}
                  error={touched.gender && errors.gender ? errors.gender : undefined}
                  leftIcon={<Users size={20} color={colors.textLight} />}
                />

                <Input
                  label="Referral Code (Optional)"
                  placeholder="Enter referral code if any"
                  value={values.referralCode}
                  onChangeText={handleChange('referralCode')}
                  onBlur={handleBlur('referralCode')}
                  error={touched.referralCode && errors.referralCode ? errors.referralCode : undefined}
                />

                <Button
                  title="Register"
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
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)')}>
              <Text style={[styles.loginText, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>
                Log In
              </Text>
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    width: '48%',
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
  loginText: {
    fontSize: 14,
  },
});