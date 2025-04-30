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
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowDownLeft, ArrowUpRight, ChevronRight, Clock, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { api } from '@/lib/api';

// Order status enum to match API documentation
enum OrderStatus {
  CREATED = 0,
  WAITING_FOR_PAYMENT = 1,
  PAID = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  DISPUTED = 5,
}

// Trade/Order interface
interface Trade {
  id: number;
  bybitItemId: string;
  tokenId: string;
  currencyId: string;
  side: 0 | 1; // 0 for buy, 1 for sell
  orderType: 'LIMIT' | 'MARKET';
  amount: number;
  price: number;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export default function TradesScreen() {
  const { colors, isDark } = useTheme();
  
  const [trades, setTrades] = useState<Trade[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'sell'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo purposes
      // In a real app, this would call the API endpoint
      setTrades([
        {
          id: 1,
          bybitItemId: 'bybit-123',
          tokenId: 'USDT',
          currencyId: 'NGN',
          side: 0, // Buy
          orderType: 'LIMIT',
          amount: 50000,
          price: 1200,
          quantity: 41.67,
          status: OrderStatus.COMPLETED,
          createdAt: '2023-09-15T14:30:00Z',
          updatedAt: '2023-09-15T15:30:00Z',
        },
        {
          id: 2,
          bybitItemId: 'bybit-456',
          tokenId: 'USDT',
          currencyId: 'NGN',
          side: 1, // Sell
          orderType: 'LIMIT',
          amount: 30000,
          price: 1210,
          quantity: 24.79,
          status: OrderStatus.WAITING_FOR_PAYMENT,
          createdAt: '2023-09-14T10:15:00Z',
          updatedAt: '2023-09-14T10:15:00Z',
        },
        {
          id: 3,
          bybitItemId: 'bybit-789',
          tokenId: 'BTC',
          currencyId: 'NGN',
          side: 0, // Buy
          orderType: 'MARKET',
          amount: 100000,
          price: 25000000,
          quantity: 0.004,
          status: OrderStatus.PAID,
          createdAt: '2023-09-13T16:45:00Z',
          updatedAt: '2023-09-13T17:00:00Z',
        },
        {
          id: 4,
          bybitItemId: 'bybit-101',
          tokenId: 'ETH',
          currencyId: 'NGN',
          side: 1, // Sell
          orderType: 'LIMIT',
          amount: 75000,
          price: 1500000,
          quantity: 0.05,
          status: OrderStatus.CANCELLED,
          createdAt: '2023-09-12T09:30:00Z',
          updatedAt: '2023-09-12T10:15:00Z',
        },
        {
          id: 5,
          bybitItemId: 'bybit-102',
          tokenId: 'USDT',
          currencyId: 'NGN',
          side: 0, // Buy
          orderType: 'LIMIT',
          amount: 25000,
          price: 1205,
          quantity: 20.75,
          status: OrderStatus.DISPUTED,
          createdAt: '2023-09-11T13:20:00Z',
          updatedAt: '2023-09-11T14:30:00Z',
        },
      ]);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrades();
    setRefreshing(false);
  };

  const getFilteredTrades = () => {
    if (activeTab === 'all') return trades;
    return trades.filter(trade => (activeTab === 'buy' ? trade.side === 0 : trade.side === 1));
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
      case OrderStatus.WAITING_FOR_PAYMENT:
        return <Clock size={16} color={colors.warning} />;
      case OrderStatus.PAID:
        return <Clock size={16} color={colors.primary} />;
      case OrderStatus.COMPLETED:
        return <CheckCircle2 size={16} color={colors.success} />;
      case OrderStatus.CANCELLED:
        return <XCircle size={16} color={colors.error} />;
      case OrderStatus.DISPUTED:
        return <AlertTriangle size={16} color={colors.warning} />;
      default:
        return <Clock size={16} color={colors.warning} />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'Created';
      case OrderStatus.WAITING_FOR_PAYMENT:
        return 'Awaiting Payment';
      case OrderStatus.PAID:
        return 'Paid';
      case OrderStatus.COMPLETED:
        return 'Completed';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      case OrderStatus.DISPUTED:
        return 'Disputed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
      case OrderStatus.WAITING_FOR_PAYMENT:
        return colors.warning;
      case OrderStatus.PAID:
        return colors.primary;
      case OrderStatus.COMPLETED:
        return colors.success;
      case OrderStatus.CANCELLED:
        return colors.error;
      case OrderStatus.DISPUTED:
        return colors.warning;
      default:
        return colors.textLight;
    }
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
          Trades
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title="Buy Crypto"
          onPress={() => router.push('/modal/buy-crypto')}
          variant="primary"
          icon={<ArrowDownLeft size={18} color={colors.white} />}
          iconPosition="left"
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Sell Crypto"
          onPress={() => router.push('/modal/sell-crypto')}
          variant="outline"
          icon={<ArrowUpRight size={18} color={colors.primary} />}
          iconPosition="left"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && [styles.activeTab, { borderColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'all' ? colors.primary : colors.textLight, fontFamily: 'DMSans_500Medium' },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'buy' && [styles.activeTab, { borderColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('buy')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'buy' ? colors.primary : colors.textLight, fontFamily: 'DMSans_500Medium' },
            ]}
          >
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sell' && [styles.activeTab, { borderColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('sell')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'sell' ? colors.primary : colors.textLight, fontFamily: 'DMSans_500Medium' },
            ]}
          >
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {getFilteredTrades().length === 0 ? (
          <Card style={styles.emptyStateCard}>
            <Text style={[styles.emptyStateTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              No trades found
            </Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              {activeTab === 'all'
                ? 'You haven\'t made any trades yet.'
                : activeTab === 'buy'
                ? 'You haven\'t made any buy trades yet.'
                : 'You haven\'t made any sell trades yet.'}
            </Text>
            <Button
              title={activeTab === 'sell' ? 'Sell Crypto' : 'Buy Crypto'}
              onPress={() => router.push(activeTab === 'sell' ? '/modal/sell-crypto' : '/modal/buy-crypto')}
              variant="primary"
              icon={<Plus size={18} color={colors.white} />}
              iconPosition="left"
              style={styles.createTradeButton}
            />
          </Card>
        ) : (
          <Card style={styles.tradesCard}>
            {getFilteredTrades().map((trade, index) => (
              <TouchableOpacity
                key={trade.id}
                style={[
                  styles.tradeItem,
                  index < getFilteredTrades().length - 1 &&
                    styles.tradeItemBorder,
                  index < getFilteredTrades().length - 1 &&
                    { borderBottomColor: isDark ? colors.gray[800] : colors.gray[200] },
                ]}
                onPress={() => router.push(`/orders/${trade.id}`)}
              >
                <View
                  style={[
                    styles.tradeIconContainer,
                    {
                      backgroundColor:
                        trade.side === 0 ? colors.success + '15' : colors.primary + '15',
                    },
                  ]}
                >
                  {trade.side === 0 ? (
                    <ArrowDownLeft size={20} color={colors.success} />
                  ) : (
                    <ArrowUpRight size={20} color={colors.primary} />
                  )}
                </View>
                <View style={styles.tradeDetails}>
                  <View style={styles.tradeHeader}>
                    <Text style={[styles.tradeType, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                      {trade.side === 0 ? 'Buy' : 'Sell'} {trade.tokenId}
                    </Text>
                    <Text style={[styles.tradeAmount, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
                      {formatCurrency(trade.amount, trade.currencyId)}
                    </Text>
                  </View>

                  <View style={styles.tradeSubDetails}>
                    <Text style={[styles.tradeDetail, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                      {trade.quantity} {trade.tokenId} @ {formatCurrency(trade.price, trade.currencyId)}
                    </Text>
                    <View style={styles.statusContainer}>
                      {getStatusIcon(trade.status)}
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(trade.status), fontFamily: 'DMSans_500Medium', marginLeft: 4 },
                        ]}
                      >
                        {getStatusText(trade.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tradeFooter}>
                    <Text style={[styles.tradeDate, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
                      {formatDate(trade.createdAt)}
                    </Text>
                    <ChevronRight size={16} color={colors.textLight} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
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
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 40,
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
  createTradeButton: {
    minWidth: 200,
  },
  tradesCard: {
    padding: 0,
    overflow: 'hidden',
  },
  tradeItem: {
    flexDirection: 'row',
    padding: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  tradeItemBorder: {
    borderBottomWidth: 1,
  },
  tradeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tradeDetails: {
    flex: 1,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tradeType: {
    fontSize: 16,
  },
  tradeAmount: {
    fontSize: 16,
  },
  tradeSubDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeDetail: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
  },
  tradeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tradeDate: {
    fontSize: 12,
  },
});