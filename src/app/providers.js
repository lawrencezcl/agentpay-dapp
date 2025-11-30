/**
 * Mock Web3 providers for the AgentPay application (testing mode)
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { createContext, useContext, useState, useEffect } from 'react';

const queryClient = new QueryClient();

// Mock wallet context
const MockWalletContext = createContext();

export function useAccount() {
  const context = useContext(MockWalletContext);
  if (!context) {
    return { address: null, isConnected: false, connector: null };
  }
  return context;
}

export function useConnect() {
  const context = useContext(MockWalletContext);
  return {
    connect: () => {
      context?.setAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
      context?.setIsConnected(true);
    }
  };
}

export function useDisconnect() {
  const context = useContext(MockWalletContext);
  return {
    disconnect: () => {
      context?.setAddress(null);
      context?.setIsConnected(false);
    }
  };
}

function MockWalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <MockWalletContext.Provider value={{
      address,
      isConnected,
      setAddress,
      setIsConnected,
      connector: { name: 'MockMetaMask' }
    }}>
      {children}
    </MockWalletContext.Provider>
  );
}

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MockWalletProvider>
        {children}
      </MockWalletProvider>
    </QueryClientProvider>
  );
}