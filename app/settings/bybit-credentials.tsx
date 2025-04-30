import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { ArrowLeft, Check, CircleAlert as AlertCircle, Key, ExternalLink } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { api } from '@/lib/api';

const BybitCredentialsSchema = Yup.object().shape({
  apiKey: Yup.string().required('API Key is required'),
  apiSecret: Yup.string().required('API Secret is required'),
});

export default function BybitCredentialsScreen() {
  const { colors, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    checkCredentials();
  }, []);

  const checkCredentials = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/bybit/verify-credentials');
      setHasCredentials(response.success && response.data === true);
      setIsVerified(response.success && response.data === true);
    } catch (error) {
      console.error('Error checking credentials:', error);
      setHasCredentials(false);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: { apiKey: string; apiSecret: string }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/bybit/credentials', values);
      
      if (response.success) {
        await verifyCredentials();
      } else {
        Alert.alert('Error', response.message || 'Failed to save credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCredentials = async () => {
    setIsVerifying(true);
    try {
      const response = await api.post('/api/bybit/verify-credentials');
      setIsVerified(response.success && response.data === true);
      setHasCredentials(response.success && response.data === true);
      
      if (response.success && response.data === true) {
        Alert.alert('Success', 'Your Bybit credentials have been verified successfully.');
      } else {
        Alert.alert('Verification Failed', 'Your Bybit credentials could not be verified. Please check them and try again.');
      }
    } catch (error: any) {
      Alert.alert('Verification Error', error.message || 'Failed to verify credentials');
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const openBybitApiDocs = () => {
    // For web, we would use Linking.openURL
    // For simplicity, we're just showing how we would handle this
    if (Platform.OS === 'web') {
      window.open('https://bybit-exchange.github.io/docs/account-asset/create-api', '_blank');
    } else {
      // In a real app, we would use Linking from react-native
      Alert.alert('Info', 'This would open the Bybit API documentation in your browser.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            Bybit API Credentials
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.description, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
            Connect your Bybit account to enable automated cryptocurrency trading through Papay Moni.
          </Text>

          {/* Verification Status */}
          <Card 
            style={styles.statusCard} 
            variant={hasCredentials ? 'default' : 'flat'}
          >
            <View style={styles.statusHeader}>
              <Text style={[styles.statusTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                Connection Status
              </Text>
              {hasCredentials && (
                <TouchableOpacity 
                  style={[
                    styles.verifyButton, 
                    { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={verifyCredentials}
                  disabled={isVerifying}
                >
                  <Text style={[styles.verifyText, { color: colors.primary, fontFamily: 'DMSans_500Medium' }]}>
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.statusContainer}>
              {hasCredentials ? (
                isVerified ? (
                  <>
                    <View style={[styles.statusIconContainer, { backgroundColor: colors.success + '20' }]}>
                      <Check size={24} color={colors.success} />
                    </View>
                    <View style={styles.statusTextContainer}>
                      <Text style={[styles.statusHeading, { color: colors.success, fontFamily: 'DMSans_700Bold' }]}>
                        Connected
                      </Text>
                      <Text style={[styles.statusMessage, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                        Your Bybit account is connected and verified.
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.statusIconContainer, { backgroundColor: colors.warning + '20' }]}>
                      <AlertCircle size={24} color={colors.warning} />
                    </View>
                    <View style={styles.statusTextContainer}>
                      <Text style={[styles.statusHeading, { color: colors.warning, fontFamily: 'DMSans_700Bold' }]}>
                        Verification Needed
                      </Text>
                      <Text style={[styles.statusMessage, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                        Credentials saved but not verified. Please verify.
                      </Text>
                    </View>
                  </>
                )
              ) : (
                <>
                  <View style={[styles.statusIconContainer, { backgroundColor: colors.error + '20' }]}>
                    <Key size={24} color={colors.error} />
                  </View>
                  <View style={styles.statusTextContainer}>
                    <Text style={[styles.statusHeading, { color: colors.error, fontFamily: 'DMSans_700Bold' }]}>
                      Not Connected
                    </Text>
                    <Text style={[styles.statusMessage, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                      Please enter your Bybit API credentials.
                    </Text>
                  </View>
                </>
              )}
            </View>
          </Card>

          {/* API Credentials Form */}
          <Card style={styles.formCard}>
            <Text style={[styles.formTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              {hasCredentials ? 'Update Credentials' : 'Enter Credentials'}
            </Text>
            
            <Formik
              initialValues={{ apiKey: '', apiSecret: '' }}
              validationSchema={BybitCredentialsSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <Input
                    label="API Key"
                    placeholder="Enter your Bybit API key"
                    value={values.apiKey}
                    onChangeText={handleChange('apiKey')}
                    onBlur={handleBlur('apiKey')}
                    error={touched.apiKey && errors.apiKey ? errors.apiKey : undefined}
                    secureTextEntry={false}
                    autoCapitalize="none"
                  />

                  <Input
                    label="API Secret"
                    placeholder="Enter your Bybit API secret"
                    value={values.apiSecret}
                    onChangeText={handleChange('apiSecret')}
                    onBlur={handleBlur('apiSecret')}
                    error={touched.apiSecret && errors.apiSecret ? errors.apiSecret : undefined}
                    secureTextEntry={true}
                    showPasswordToggle={true}
                    autoCapitalize="none"
                  />

                  <Button
                    title={hasCredentials ? 'Update Credentials' : 'Save Credentials'}
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
          </Card>

          {/* Help Card */}
          <Card style={styles.helpCard} variant="flat">
            <View style={styles.helpHeader}>
              <Text style={[styles.helpTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                How to Create Bybit API Keys
              </Text>
            </View>
            <Text style={[styles.helpText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              1. Log in to your Bybit account
            </Text>
            <Text style={[styles.helpText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              2. Go to Account {">"} API Management
            </Text>
            <Text style={[styles.helpText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              3. Click on "Create New Key"
            </Text>
            <Text style={[styles.helpText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              4. Select "ReadOnly" for API restrictions if you want to just track your trades, or "Trade" if you want to allow automatic trading
            </Text>
            <Text style={[styles.helpText, { color: colors.textLight, fontFamily: 'DMSans_400Regular', marginBottom: 16 }]}>
              5. Copy your API Key and API Secret and paste them here
            </Text>
            
            <TouchableOpacity 
              style={[styles.docsButton, { borderColor: colors.border }]}
              onPress={openBybitApiDocs}
            >
              <Text style={[styles.docsText, { color: colors.primary, fontFamily: 'DMSans_500Medium' }]}>
                View Bybit API Documentation
              </Text>
              <ExternalLink size={16} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </Card>
        </ScrollView>

        <LoadingOverlay visible={isVerifying} message="Verifying credentials..." />
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  statusCard: {
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  verifyText: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusHeading: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  helpCard: {
    marginBottom: 24,
  },
  helpHeader: {
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 16,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  docsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  docsText: {
    fontSize: 14,
  },
});