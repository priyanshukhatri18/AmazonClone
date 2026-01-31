import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/authContext';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="(modals)/profileModal" 
          options={{ 
            presentation: "modal" 
          }} 
        />
        <Stack.Screen 
          name="(modals)/privacyPolicyModal" 
          options={{ 
            presentation: "modal" 
          }} 
        />
        <Stack.Screen 
          name="(modals)/walletModal" 
          options={{ 
            presentation: "modal" 
          }} 
        />
         <Stack.Screen 
          name="(modals)/transactionModal" 
          options={{ 
            presentation: "modal" 
          }} 
        />
        
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
