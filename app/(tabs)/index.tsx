import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  RefreshCw, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Bell, 
  ChevronRight,
  Info,
  TrendingUp
} from 'lucide-react-native';
import { api } from '@/lib/api';

interface TransactionItem {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
  description?: string;
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<TransactionItem[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await refreshUser();
      await checkBybitCredentials();
      await fetchRecentTransactions();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } finally {
      setRefreshing(false);
    }
  };

  const checkBybitCredentials = async () => {
    try {
      const response = await api.post('/api/bybit/verify-credentials');
      setHasCredentials(response.success && response.data === true);
    } catch (error) {
      console.error('Error checking Bybit credentials:', error);
      setHasCredentials(false);
    }
  };

  const fetchRecentTransactions = async () => {
    // This would be a real API call in production
    // Mocking data for demo purposes
    setRecentTransactions([
      {
        id: 1,
        type: 'DEPOSIT',
        amount: 50000,
        currency: 'NGN',
        status: 'COMPLETED',
        createdAt: '2023-09-15T14:30:00Z',
        description: 'Bank transfer from GTBank'
      },
      {
        id: 2,
        type: 'WITHDRAWAL',
        amount: 20000,
        currency: 'NGN',
        status: 'COMPLETED',
        createdAt: '2023-09-14T10:15:00Z',
        description: 'Withdrawal to First Bank'
      },
      {
        id: 3,
        type: 'DEPOSIT',
        amount: 15000,
        currency: 'NGN',
        status: 'PENDING',
        createdAt: '2023-09-13T16:45:00Z',
        description: 'Bank transfer from Zenith Bank'
      }
    ]);
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
        <View>
          <Text style={[styles.greeting, { color: colors.text, fontFamily: 'DMSans_400Regular' }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            {user?.firstName || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Account Balance Card */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              Your Balance
            </Text>
            <TouchableOpacity style={styles.refreshButton}>
              <RefreshCw size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.balanceAmount, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            {user?.virtualAccount ? formatCurrency(user.virtualAccount.balance, user.virtualAccount.currency) : 'N/A'}
          </Text>
          <Text style={[styles.accountNumber, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
            {user?.virtualAccount ? `Account: ${user.virtualAccount.accountNumber}` : 'No account'}
          </Text>
          
          <View style={styles.actionButtons}>
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

        {/* Bybit Credentials Alert */}
        {!hasCredentials && (
          <Card 
            variant="flat" 
            style={[styles.alertCard, { backgroundColor: colors.warning + '20' }]}
          >
            <View style={styles.alertContent}>
              <Info size={24} color={colors.warning} style={styles.alertIcon} />
              <View style={styles.alertTextContainer}>
                <Text style={[styles.alertTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                  Connect Your Bybit Account
                </Text>
                <Text style={[styles.alertDescription, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                  Link your Bybit account to start automated trading.
                </Text>
              </View>
            </View>
            <Button
              title="Connect"
              onPress={() => router.push('/settings/bybit-credentials')}
              variant="outline"
              size="sm"
            />
          </Card>
        )}

        {/* Quick Access Card */}
        <Card style={styles.quickAccessCard}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            Quick Access
          </Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }]}
              onPress={() => router.push('/modal/buy-crypto')}
            >
              <ArrowDownLeft size={24} color={colors.success} style={styles.quickAccessIcon} />
              <Text style={[styles.quickAccessText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                Buy Crypto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }]}
              onPress={() => router.push('/modal/sell-crypto')}
            >
              <ArrowUpRight size={24} color={colors.primary} style={styles.quickAccessIcon} />
              <Text style={[styles.quickAccessText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                Sell Crypto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickAccessItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }]}
              onPress={() => router.push('/trades')}
            >
              <TrendingUp size={24} color={colors.accent} style={styles.quickAccessIcon} />
              <Text style={[styles.quickAccessText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                My Trades
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

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

          {recentTransactions.length > 0 ? (
            <Card style={styles.transactionsCard}>
              {recentTransactions.map((transaction, index) => (
                <TouchableOpacity 
                  key={transaction.id}
                  style={[
                    styles.transactionItem, 
                    index < recentTransactions.length - 1 && 
                    styles.transactionItemBorder,
                    index < recentTransactions.length - 1 && 
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
          ) : (
            <Card style={styles.emptyTransactionsCard}>
              <Text style={[styles.emptyStateText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                No recent transactions
              </Text>
            </Card>
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  balanceCard: {
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
  },
  refreshButton: {
    padding: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  balanceAmount: {
    fontSize: 32,
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 12,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  alertCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
  },
  quickAccessCard: {
    marginBottom: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -8,
  },
  quickAccessItem: {
    width: '30%',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: '1.65%',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  quickAccessIcon: {
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    textAlign: 'center',
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
  emptyTransactionsCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 14,
  },
});