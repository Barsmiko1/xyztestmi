import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Copy, CircleCheck as CheckCircle2, CreditCard } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function DepositScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedText(text);
    
    // Trigger haptic feedback on mobile devices
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Clear the copied status after 3 seconds
    setTimeout(() => {
      setCopiedText(null);
    }, 3000);
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
            Deposit Funds
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.description, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
            To deposit funds into your Papay Moni account, make a bank transfer to the account details below.
          </Text>
          
          {user?.virtualAccount ? (
            <Card style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <Text style={[styles.accountCardTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                  Your Virtual Account
                </Text>
                <View style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: user.virtualAccount.active ? colors.success + '20' : colors.error + '20',
                    borderColor: user.virtualAccount.active ? colors.success : colors.error
                  }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { 
                      color: user.virtualAccount.active ? colors.success : colors.error,
                      fontFamily: 'DMSans_500Medium'
                    }
                  ]}>
                    {user.virtualAccount.active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>

              <View style={styles.accountDetails}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                    Account Name
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                    {user.virtualAccount.accountName}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                    Bank Name
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                    {user.virtualAccount.bankName}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                    Account Number
                  </Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                      {user.virtualAccount.accountNumber}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => copyToClipboard(user.virtualAccount.accountNumber)}
                      style={styles.copyButton}
                    >
                      {copiedText === user.virtualAccount.accountNumber ? (
                        <CheckCircle2 size={16} color={colors.success} />
                      ) : (
                        <Copy size={16} color={colors.textLight} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                    Bank Code
                  </Text>
                  <View style={styles.detailValueContainer}>
                    <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                      {user.virtualAccount.bankCode}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => copyToClipboard(user.virtualAccount.bankCode)}
                      style={styles.copyButton}
                    >
                      {copiedText === user.virtualAccount.bankCode ? (
                        <CheckCircle2 size={16} color={colors.success} />
                      ) : (
                        <Copy size={16} color={colors.textLight} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                    Currency
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                    {user.virtualAccount.currency}
                  </Text>
                </View>
              </View>
            </Card>
          ) : (
            <Card style={styles.noAccountCard}>
              <CreditCard size={48} color={colors.textLight} style={styles.noAccountIcon} />
              <Text style={[styles.noAccountTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                No Virtual Account
              </Text>
              <Text style={[styles.noAccountDescription, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                You don't have a virtual account yet. Create one to start receiving deposits.
              </Text>
              <Button
                title="Create Virtual Account"
                onPress={() => router.push('/modal/create-account')}
                variant="primary"
                style={styles.createAccountButton}
              />
            </Card>
          )}
          
          <Card style={styles.instructionsCard}>
            <Text style={[styles.instructionsTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              How to Deposit
            </Text>
            <View style={styles.instructionsStep}>
              <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.stepNumber, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                Copy your virtual account details.
              </Text>
            </View>
            <View style={styles.instructionsStep}>
              <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.stepNumber, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                Make a bank transfer from any Nigerian bank to this account.
              </Text>
            </View>
            <View style={styles.instructionsStep}>
              <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.stepNumber, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                Your account will be credited automatically once the transfer is complete.
              </Text>
            </View>
            <View style={styles.instructionsStep}>
              <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.stepNumber, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>4</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                You will receive a notification when your deposit is confirmed.
              </Text>
            </View>
          </Card>
          
          <Card style={styles.infoCard} variant="flat">
            <Text style={[styles.infoTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              Important Information
            </Text>
            <Text style={[styles.infoText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              • Deposits are typically credited within 5-10 minutes.
            </Text>
            <Text style={[styles.infoText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              • Minimum deposit amount: NGN 1,000.
            </Text>
            <Text style={[styles.infoText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              • Make sure the account name matches the one registered with Papay Moni.
            </Text>
            <Text style={[styles.infoText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              • For issues with deposits, please contact customer support.
            </Text>
          </Card>
        </ScrollView>
        
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button
            title="Done"
            onPress={() => router.back()}
            variant="primary"
            size="lg"
            fullWidth
          />
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  accountCard: {
    marginBottom: 24,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountCardTitle: {
    fontSize: 18,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
  },
  accountDetails: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
  },
  copyButton: {
    padding: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  noAccountCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  noAccountIcon: {
    marginBottom: 16,
  },
  noAccountTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  noAccountDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  createAccountButton: {
    minWidth: 200,
  },
  instructionsCard: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  instructionsStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 14,
  },
  stepText: {
    fontSize: 14,
    flex: 1,
  },
  infoCard: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});