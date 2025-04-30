import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen name="deposit" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="buy-crypto" />
      <Stack.Screen name="sell-crypto" />
      <Stack.Screen name="create-account" />
    </Stack>
  );
}