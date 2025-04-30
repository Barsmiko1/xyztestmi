import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, CreditCard, Copy, CircleCheck as CheckCircle2, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { api } from '@/lib/api';
import * as Haptics from 'expo-haptics';

interface VirtualAccount {
  id: number;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
  currency: string;
  balance: number;
  active: boolean;
}

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
  description?: string;
}

export default function AccountsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [accounts, setAccounts] = useState<VirtualAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call your API
      if (user?.virtualAccount) {
        setAccounts([user.virtualAccount]);
      } else {
        setAccounts([]);
      }
      
      // Mock transactions for demo
      setTransactions([
        {
          id: 1,
          amount: 50000,
          currency: 'NGN',
          type: 'DEPOSIT',
          status: 'COMPLETED',
          createdAt: '2023-09-15T14:30:00Z',
          description: 'Bank transfer from GTBank'
        },
        {
          id: 2,
          amount: 20000,
          currency: 'NGN',
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          createdAt: '2023-09-14T10:15:00Z',
          description: 'Withdrawal to First Bank'
        },
        {
          id: 3,
          amount: 15000,
          currency: 'NGN',
          type: 'DEPOSIT',
          status: 'PENDING',
          createdAt: '2023-09-13T16:45:00Z',
          description: 'Bank transfer from Zenith Bank'
        }
      ]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAccounts();
    setRefreshing(false);
  };

  const handleCreateAccount = async () => {
    router.push('/modal/create-account');
  };

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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
          Virtual Accounts
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {accounts.length === 0 ? (
          <Card style={styles.emptyStateCard}>
            <CreditCard size={48} color={colors.textLight} style={styles.emptyStateIcon} />
            <Text style={[styles.emptyStateTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              No Virtual Accounts
            </Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              Create a virtual account to start receiving deposits and making withdrawals.
            </Text>
            <Button
              title="Create Virtual Account"
              onPress={handleCreateAccount}
              variant="primary"
              icon={<Plus size={18} color={colors.white} />}
              iconPosition="left"
              style={styles.createAccountButton}
            />
          </Card>
        ) : (
          <>
            {accounts.map((account) => (
              <Card key={account.id} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <View style={styles.accountInfo}>
                    <Text style={[styles.accountName, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                      {account.accountName}
                    </Text>
                    <Text style={[styles.bankName, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                      {account.bankName}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: account.active ? colors.success + '20' : colors.error + '20',
                      borderColor: account.active ? colors.success : colors.error
                    }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      { 
                        color: account.active ? colors.success : colors.error,
                        fontFamily: 'DMSans_500Medium'
                      }
                    ]}>
                      {account.active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.balanceTitle, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                  Balance
                </Text>
                <Text style={[styles.balanceAmount, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                  {formatCurrency(account.balance, account.currency)}
                </Text>
                
                <View style={styles.accountDetails}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                      Account Number
                    </Text>
                    <View style={styles.detailValueContainer}>
                      <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                        {account.accountNumber}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => copyToClipboard(account.accountNumber)}
                        style={styles.copyButton}
                      >
                        {copiedText === account.accountNumber ? (
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
                        {account.bankCode}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => copyToClipboard(account.bankCode)}
                        style={styles.copyButton}
                      >
                        {copiedText === account.bankCode ? (
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
                      {account.currency}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.accountActions}>
                  <Button
                    title="Deposit"
                    onPress={() => router.push('/modal/deposit')}
                    variant="primary"
                    icon={<ArrowDownLeft size={18} color={colors.white} />}
                    iconPosition="left"
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="Withdraw"
                    onPress={() => router.push('/modal/withdraw')}
                    variant="outline"
                    icon={<ArrowUpRight size={18} color={colors.primary} />}
                    iconPosition="left"
                    style={{ flex: 1, marginLeft: 8 }}
                  />
                </View>
              </Card>
            ))}

            {/* Recent Transactions */}
            <View style={styles.transactionsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                  Recent Transactions
                </Text>
                <TouchableOpacity onPress={() => router.push('/transactions')}>
                  <Text style={[styles.seeAll, { color: colors.primary, fontFamily: 'DMSans_500Medium' }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <Card style={styles.transactionsCard}>
                {transactions.map((transaction, index) => (
                  <TouchableOpacity 
                    key={transaction.id}
                    style={[
                      styles.transactionItem, 
                      index < transactions.length - 1 && 
                      styles.transactionItemBorder,
                      index < transactions.length - 1 && 
                      { borderBottomColor: isDark ? colors.gray[800] : colors.gray[200] }
                    ]}
                    onPress={() => router.push(`/transactions/${transaction.id}`)}
                  >
                    <View style={[
                      styles.transactionIconContainer, 
                      { 
                        backgroundColor: transaction.type === 'DEPOSIT' 
                          ? colors.success + '15' 
                          : colors.primary + '15' 
                      }
                    ]}>
                      {transaction.type === 'DEPOSIT' ? (
                        <ArrowDownLeft size={20} color={colors.success} />
                      ) : (
                        <ArrowUpRight size={20} color={colors.primary} />
                      )}
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionType, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                        {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                      </Text>
                      <Text style={[styles.transactionDate, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text style={[
                        styles.amountText, 
                        { 
                          color: transaction.type === 'DEPOSIT' ? colors.success : colors.primary,
                          fontFamily: 'DMSans_700Bold'
                        }
                      ]}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                      </Text>
                      <Text style={[
                        styles.transactionStatus, 
                        { 
                          color: transaction.status === 'COMPLETED' 
                            ? colors.success 
                            : transaction.status === 'PENDING' 
                              ? colors.warning 
                              : colors.error,
                          fontFamily: 'DMSans_400Regular'
                        }
                      ]}>
                        {transaction.status}
                      </Text>
                    </View>
                    <ChevronRight size={16} color={colors.textLight} />
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  createAccountButton: {
    minWidth: 200,
  },
  accountCard: {
    marginBottom: 24,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
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
  balanceTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    marginBottom: 16,
  },
  accountDetails: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  accountActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
  },
  seeAll: {
    fontSize: 14,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  transactionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  amountText: {
    fontSize: 14,
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
  },
});