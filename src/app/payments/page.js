/**
 * ACTUAL Payment Creation Page - Redesigned with shadcn/ui
 * Real functionality for creating and executing AI-powered payments
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount } from '../providers';
import realPaymentProcessor from '../../../services/realPaymentProcessor.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function PaymentsPage() {
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Form state
  const [paymentRequest, setPaymentRequest] = useState({
    description: '',
    amount: '',
    token: 'ETH',
    recipient: '',
    urgency: 'medium'
  });

  useEffect(() => {
    if (isConnected) {
      initializePaymentProcessor();
      loadPaymentData();
    }
  }, [isConnected]);

  const initializePaymentProcessor = async () => {
    try {
      await realPaymentProcessor.initialize();
      console.log('🚀 Real Payment Processor initialized');
    } catch (error) {
      console.error('Failed to initialize payment processor:', error);
    }
  };

  const loadPaymentData = () => {
    const data = realPaymentProcessor.getPaymentAnalytics();
    setAnalytics(data);
    setPayments(data.recentPayments || []);
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    try {
      const paymentIntent = await realPaymentProcessor.createPaymentIntent({
        description: paymentRequest.description,
        amount: parseFloat(paymentRequest.amount),
        token: paymentRequest.token,
        recipient: paymentRequest.recipient,
        urgency: paymentRequest.urgency
      });

      setPayments(prev => [paymentIntent, ...prev]);

      // Clear form
      setPaymentRequest({
        description: '',
        amount: '',
        token: 'ETH',
        recipient: '',
        urgency: 'medium'
      });

      // Update analytics
      loadPaymentData();

      alert('✅ Payment Intent Created! AI analysis complete.\n' +
            `Risk Score: ${paymentIntent.riskAssessment.score}/100\n` +
            `Gas Estimate: ${paymentIntent.contractData.estimatedGas} wei`);

    } catch (error) {
      console.error('Payment creation failed:', error);
      alert('❌ Failed to create payment: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleExecutePayment = async (paymentId) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsExecuting(true);
    try {
      const executedPayment = await realPaymentProcessor.executePayment(paymentId);

      setPayments(prev => prev.map(p =>
        p.id === paymentId ? executedPayment : p
      ));

      // Update analytics
      loadPaymentData();

      alert('✅ Payment Executed Successfully!\n' +
            `Transaction Hash: ${executedPayment.txHash}\n` +
            `Gas Used: ${executedPayment.actualGasUsed} wei`);

    } catch (error) {
      console.error('Payment execution failed:', error);
      alert('❌ Failed to execute payment: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      executing: 'info',
      failed: 'destructive',
      pending_approval: 'warning'
    };
    return variants[status] || 'default';
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet to Access Payments</CardTitle>
            <CardDescription>
              Please connect your wallet to create and execute AI-powered payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/'}>
              Go to Homepage to Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">AgentPay Payments</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-semibold">{analytics.total}</p>
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
                  <p className="text-2xl font-semibold">{analytics.successRate.toFixed(1)}%</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                  <p className="text-2xl font-semibold">{analytics.avgRiskScore.toFixed(0)}</p>
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
                  <p className="text-2xl font-semibold">{analytics.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create AI-Powered Payment</CardTitle>
              <CardDescription>
                Use natural language to describe your payment request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Description (Natural Language)
                  </label>
                  <Textarea
                    value={paymentRequest.description}
                    onChange={(e) => setPaymentRequest({...paymentRequest, description: e.target.value})}
                    rows={4}
                    placeholder="e.g., Pay 0.5 ETH to 0x7099... for development work when ETH price is above $2200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount
                    </label>
                    <Input
                      type="number"
                      step="0.001"
                      value={paymentRequest.amount}
                      onChange={(e) => setPaymentRequest({...paymentRequest, amount: e.target.value})}
                      placeholder="0.1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Token
                    </label>
                    <Select
                      value={paymentRequest.token}
                      onChange={(e) => setPaymentRequest({...paymentRequest, token: e.target.value})}
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="CRO">CRO</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Recipient Address
                  </label>
                  <Input
                    type="text"
                    value={paymentRequest.recipient}
                    onChange={(e) => setPaymentRequest({...paymentRequest, recipient: e.target.value})}
                    placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Urgency
                  </label>
                  <Select
                    value={paymentRequest.urgency}
                    onChange={(e) => setPaymentRequest({...paymentRequest, urgency: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? '🤖 AI Processing...' : '🚀 Create Payment Intent'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payment List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                Track your AI-powered payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {payments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No payments yet. Create your first AI-powered payment!
                  </p>
                ) : (
                  payments.map((payment) => (
                    <Card key={payment.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">
                                {payment.amount} {payment.token}
                              </p>
                              <Badge variant={getStatusBadge(payment.status)}>
                                {payment.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              To: {payment.recipient?.slice(0, 10)}...{payment.recipient?.slice(-8)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {payment.description}
                            </p>
                          </div>
                        </div>

                        {payment.riskAssessment && (
                          <div className="text-xs text-muted-foreground mb-2">
                            Risk Score:{' '}
                            <span className={`font-medium ${
                              payment.riskAssessment.score > 70 ? 'text-red-600' :
                              payment.riskAssessment.score > 40 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {payment.riskAssessment.score}/100
                            </span>
                          </div>
                        )}

                        {payment.contractData && (
                          <div className="text-xs text-muted-foreground mb-3">
                            Gas Estimate: {(parseInt(payment.contractData.estimatedGas) / 1000000000000).toFixed(2)} TGwei
                          </div>
                        )}

                        {payment.status === 'pending_approval' && (
                          <Button
                            onClick={() => handleExecutePayment(payment.id)}
                            disabled={isExecuting}
                            variant="default"
                            className="w-full"
                            size="sm"
                          >
                            {isExecuting ? '⚡ Executing...' : '⚡ Execute Payment'}
                          </Button>
                        )}

                        {payment.txHash && (
                          <div className="text-xs text-blue-600 mt-2 font-mono">
                            Tx: {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}