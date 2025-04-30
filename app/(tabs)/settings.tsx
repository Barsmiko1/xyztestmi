import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { User, Key, Moon, Sun, ChevronRight, Shield, CreditCard, Bell, FileText, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, isDark, setThemeMode, themeMode } = useTheme();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(isDark);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setThemeMode(newMode ? 'dark' : 'light');
  };

  const formatFullName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`;
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={[
            styles.profileIconContainer,
            { backgroundColor: colors.primary + '15' }
          ]}>
            <Text style={[styles.profileInitials, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>
              {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              {formatFullName()}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.editProfileButton, 
              { borderColor: colors.border }
            ]}
            onPress={() => router.push('/settings/profile')}
          >
            <Text style={[styles.editProfileText, { color: colors.primary, fontFamily: 'DMSans_500Medium' }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            Account
          </Text>
          <Card style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => router.push('/settings/profile')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.primary + '15' }
                ]}>
                  <User size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Personal Information
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.settingsItem,
                styles.settingsItemBorder,
                { borderTopColor: isDark ? colors.gray[800] : colors.gray[200] }
              ]}
              onPress={() => router.push('/settings/security')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.success + '15' }
                ]}>
                  <Shield size={20} color={colors.success} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Security
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.settingsItem,
                styles.settingsItemBorder,
                { borderTopColor: isDark ? colors.gray[800] : colors.gray[200] }
              ]}
              onPress={() => router.push('/settings/bybit-credentials')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.warning + '15' }
                ]}>
                  <Key size={20} color={colors.warning} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Bybit API Credentials
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.settingsItem,
                styles.settingsItemBorder,
                { borderTopColor: isDark ? colors.gray[800] : colors.gray[200] }
              ]}
              onPress={() => router.push('/settings/payment-methods')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.accent + '15' }
                ]}>
                  <CreditCard size={20} color={colors.accent} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Payment Methods
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            Preferences
          </Text>
          <Card style={styles.settingsCard}>
            <View 
              style={styles.settingsItem}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: isDark ? colors.gray[700] : colors.gray[200] }
                ]}>
                  {isDarkMode ? (
                    <Moon size={20} color={colors.textLight} />
                  ) : (
                    <Sun size={20} color={colors.warning} />
                  )}
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.gray[300], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.settingsItem,
                styles.settingsItemBorder,
                { borderTopColor: isDark ? colors.gray[800] : colors.gray[200] }
              ]}
              onPress={() => router.push('/settings/notifications')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.primary + '15' }
                ]}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Notifications
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Support and Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
            Support & Information
          </Text>
          <Card style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => router.push('/support')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.success + '15' }
                ]}>
                  <HelpCircle size={20} color={colors.success} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Customer Support
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.settingsItem,
                styles.settingsItemBorder,
                { borderTopColor: isDark ? colors.gray[800] : colors.gray[200] }
              ]}
              onPress={() => router.push('/terms-conditions')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.accent + '15' }
                ]}>
                  <FileText size={20} color={colors.accent} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Terms & Conditions
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.settingsItem,
                styles.settingsItemBorder,
                { borderTopColor: isDark ? colors.gray[800] : colors.gray[200] }
              ]}
              onPress={() => router.push('/privacy-policy')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[
                  styles.settingsIconContainer,
                  { backgroundColor: colors.warning + '15' }
                ]}>
                  <Shield size={20} color={colors.warning} />
                </View>
                <Text style={[styles.settingsItemText, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  Privacy Policy
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '15' }
          ]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} style={styles.logoutIcon} />
          <Text style={[styles.logoutText, { color: colors.error, fontFamily: 'DMSans_700Bold' }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textLight, fontFamily: 'DMSans_400Regular' }]}>
            Papay Moni v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  editProfileText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  settingsItemBorder: {
    borderTopWidth: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
  },
});