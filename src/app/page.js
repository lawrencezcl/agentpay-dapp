/**
 * AgentPay Landing Page - Redesigned with shadcn/ui
 * AI-Powered Payment Automation for Cronos x402
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from './providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  if (isConnected && address) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold">AgentPay</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">AgentPay Dashboard</h2>
            <p className="text-muted-foreground">AI-Powered Payment Automation Platform</p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button className="px-1 py-4 text-sm font-medium text-foreground border-b-2 border-primary">
                Overview
              </button>
              <a href="/payments" className="px-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted">
                Payments
              </a>
              <a href="/payments" className="px-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted">
                Create Payment
              </a>
              <button className="px-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground">
                Analytics
              </button>
            </nav>
          </div>

          {/* Overview Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-semibold">156</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-semibold">98.7%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">AI Automated</p>
                  <p className="text-2xl font-semibold">142</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-semibold">14</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Intelligent payment automation with AI agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Natural language payment requests</h4>
                    <p className="text-sm text-muted-foreground">Create payments using plain English commands</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Real-time market data integration</h4>
                    <p className="text-sm text-muted-foreground">Automated payments based on market conditions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Risk assessment and monitoring</h4>
                    <p className="text-sm text-muted-foreground">AI-powered fraud detection and risk analysis</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment to 0x7099...7c8</p>
                      <p className="text-xs text-muted-foreground">2 ETH - Executed by AI</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment to 0x1234...5678</p>
                      <p className="text-xs text-muted-foreground">1.5 ETH - Pending market condition</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">5 min ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Batch payment (3 transactions)</p>
                      <p className="text-xs text-muted-foreground">5 ETH total - Gas optimized</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">10 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Landing page when not connected
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-pink-600">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo and Title */}
          <div className="flex justify-center items-center mb-8">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-primary">A</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            AgentPay
          </h1>

          <p className="text-2xl text-white mb-2">
            AI-Powered Payment Automation for Cronos x402
          </p>

          <div className="mb-8">
            <Badge variant="secondary" className="text-white bg-white/20">
              Build for the Cronos x402 Paytech Hackathon
            </Badge>
          </div>

          {/* Connect Wallet Button */}
          <div className="mb-16">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              variant="agentpay"
              size="lg"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white border-white/20"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">AI-Powered Automation</h3>
                <p className="text-blue-100 text-center">Smart contracts with AI agents for automated payment execution</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Lightning Fast</h3>
                <p className="text-blue-100 text-center">Built on Cronos EVM with sub-second transaction finality</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">x402 Protocol</h3>
                <p className="text-blue-100 text-center">Advanced payment facilitation with sponsored transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Stack */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-blue-200 text-sm mb-1">Smart Contracts</div>
                  <div className="text-white font-medium">Solidity</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-200 text-sm mb-1">AI Engine</div>
                  <div className="text-white font-medium">DeepSeek API</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-200 text-sm mb-1">Blockchain</div>
                  <div className="text-white font-medium">Cronos EVM</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-200 text-sm mb-1">Frontend</div>
                  <div className="text-white font-medium">Next.js 14 + shadcn/ui</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}