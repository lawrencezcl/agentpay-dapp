# AgentPay - AI-Powered Payment Automation for Cronos x402

🚀 **Built for the Cronos x402 Paytech Hackathon**

AgentPay is a cutting-edge decentralized application that combines AI agents with x402 payment flows to create intelligent, automated payment solutions on the Cronos blockchain.

## 🎯 Hackathon Targets

### Main Track - x402 Applications
- AI agents using x402 for novel, intelligent automated payments
- Agent-triggered payments with real-time conditions
- Dynamic asset management with AI optimization

### x402 Agentic Finance/Payment Track
- Automated settlement pipelines with multi-step workflows
- Risk-managed agentic portfolios
- Recurring and conditional instruction sets

### Crypto.com X Cronos Ecosystem Integration
- Deep integration with Crypto.com AI Agent SDK
- Market data integration for conditional payments
- Native wallet connectivity for seamless user experience

### Dev Tooling & Data Virtualization
- AI agent orchestration and runtime
- Debugging and monitoring for agentic transactions
- Unified data layer for AI decision making

## ✨ Key Features

### 🤖 AI-Powered Payment Automation
- **Natural Language Processing**: Create payments using plain English
- **Intelligent Conditions**: AI evaluates market conditions and triggers payments
- **Risk Assessment**: Real-time risk monitoring and fraud detection
- **Batch Processing**: Efficient handling of multiple transactions

### ⚡ x402 Integration
- **Programmatic Payments**: Smart contract-based payment flows
- **Sponsored Transactions**: Gas-less user experience with sponsor model
- **Cross-Chain Compatibility**: Built for Cronos EVM with future expansion plans

### 🔌 Crypto.com Ecosystem
- **AI Agent SDK**: Leverage Crypto.com's AI infrastructure
- **Market Data Integration**: Real-time price feeds for conditional payments
- **Wallet Connectivity**: Seamless integration with Crypto.com wallets

### 🛡️ Enterprise-Grade Security
- **Smart Contract Audited**: Secure and tested payment infrastructure
- **Multi-Signature Support**: Enhanced security for high-value transactions
- **Replay Protection**: Advanced security measures against attacks

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   AI Agent       │    │  x402 Protocol  │
│  (Next.js)      │◄──►│   Service        │◄──►│  (Smart Contracts)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Web3 Wallet    │    │  Crypto.com      │    │   Cronos EVM    │
│  Integration    │    │  AI SDK          │    │   Blockchain    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity 0.8.20**: Latest features with gas optimization
- **OpenZeppelin**: Battle-tested secure contracts
- **Hardhat**: Professional development environment

### Frontend
- **Next.js 14**: React framework with server-side rendering
- **RainbowKit**: Seamless wallet integration
- **Wagmi**: React hooks for Web3
- **Tailwind CSS**: Modern, responsive design
- **Recharts**: Beautiful data visualization

### AI & Integration
- **Crypto.com AI Agent SDK**: Advanced AI capabilities
- **OpenAI GPT-4**: Natural language processing
- **Ethers.js**: Blockchain interaction library

### Testing & Quality
- **Hardhat Testing**: Comprehensive test suite
- **TypeScript**: Type-safe development
- **ESLint & Prettier**: Code quality standards

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Cronos testnet CRO for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agentpay-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Compile smart contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

6. **Deploy to Cronos testnet**
   ```bash
   npm run deploy:testnet
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Cronos Configuration
PRIVATE_KEY=your_private_key_here
CRONOSSCAN_API_KEY=your_cronoscan_api_key_here

# Crypto.com AI Agent SDK
CRYPTO_COM_AI_API_KEY=your_crypto_com_ai_api_key_here
CRYPTO_COM_AI_SECRET=your_crypto_com_ai_secret_here

# OpenAI (for AI Agent functionality)
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXT_PUBLIC_RPC_URL=https://cronos-testnet.crypto.org:8545
NEXT_PUBLIC_CHAIN_ID=338
NEXT_PUBLIC_NETWORK_NAME="Cronos Testnet"

# x402 Configuration
X402_FACILITATOR_ADDRESS=your_x402_facilitator_address_here
```

## 🧪 Testing

### Smart Contract Tests
```bash
npm run test
```

### Frontend Tests
```bash
npm run test:frontend
```

### Integration Tests
```bash
npm run test:integration
```

## 📱 Usage Examples

### 1. Simple Payment Intent
```javascript
const paymentIntent = await agent.createPaymentIntent({
  recipient: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5d8a9",
  amount: "100",
  token: "CRO",
  condition: "Execute when CRO price > $0.10"
});
```

### 2. Natural Language Payment
```javascript
const nlPayment = await agent.processPaymentRequest(
  "Pay 50 CRO to 0x1234...5678 when ETH price increases by 5%"
);
```

### 3. Batch Processing
```javascript
const batchResult = await agent.processBatch([
  intent1, intent2, intent3
]);
```

### 4. Conditional Workflow
```javascript
const workflow = await agent.generateWorkflow({
  trigger: "Market conditions favorable",
  steps: [
    "Analyze market data",
    "Calculate risk score",
    "Execute if risk < 0.3",
    "Monitor transaction"
  ]
});
```

## 📊 Smart Contract Features

### AgentPay Contract
- **Payment Intent Management**: Create, monitor, and execute payment intents
- **AI Condition Evaluation**: Integrated with AI agents for smart condition checking
- **Risk Assessment**: Built-in risk monitoring and mitigation
- **Batch Operations**: Efficient processing of multiple payments
- **Gas Optimization**: Minimized transaction costs

### X402Facilitator Contract
- **Sponsored Transactions**: Enable gas-less user experience
- **Relayer Network**: Professional relayer infrastructure
- **Gas Management**: Optimal gas price and limit management
- **Security Controls**: Advanced security measures and monitoring

## 🏆 Competitive Advantages

1. **First-Mover Advantage**: Combining AI agents with x402 on Cronos
2. **Multiple Track Eligibility**: Strong fit for several hackathon categories
3. **Real-World Utility**: Practical payment automation solutions
4. **Deep Integration**: Comprehensive Crypto.com ecosystem integration
5. **Production Ready**: Built for scale and real deployment

## 📈 Demo Scenarios

### 1. Market-Triggered Payments
- Set up payments that execute automatically based on market conditions
- Example: "Pay supplier when CRO price > $0.15"

### 2. Subscription Automation
- Recurring payments with intelligent timing optimization
- Example: Pay monthly subscription when gas fees are lowest

### 3. Risk-Managed Treasury
- Automated treasury management with AI risk assessment
- Example: Rebalance portfolio based on market volatility

### 4. Supply Chain Payments
- Automated B2B payments with verification and routing
- Example: Pay suppliers upon delivery confirmation

## 🔧 Development Workflow

### 1. Local Development
```bash
npm run dev          # Start frontend dev server
npm run node         # Start local Hardhat node
npm run deploy:local # Deploy to local network
```

### 2. Testing
```bash
npm run test         # Run all tests
npm run test:watch   # Watch mode for testing
npm run coverage     # Generate coverage report
```

### 3. Deployment
```bash
npm run compile      # Compile contracts
npm run deploy:testnet  # Deploy to Cronos testnet
npm run verify       # Verify contracts on explorer
```

## 📚 API Documentation

### Payment Agent API
- `createPaymentIntent(request)` - Create new payment intent
- `analyzePaymentCondition(intent)` - AI condition analysis
- `processPaymentIntent(id, proof)` - Execute payment intent
- `generateWorkflow(requirements)` - Generate payment workflow

### Smart Contract API
- `createPaymentIntent()` - Create payment on-chain
- `executePaymentWithAI()` - Execute with AI verification
- `batchExecutePayments()` - Process multiple payments
- `cancelPaymentIntent()` - Cancel pending payment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cronos Labs** for the excellent hackathon platform and support
- **Crypto.com** for the AI Agent SDK and ecosystem integration
- **OpenZeppelin** for secure smart contract libraries
- **Hardhat Team** for the amazing development environment

## 📞 Contact

- **Hackathon Team**: [Team Name]
- **GitHub**: [Repository Link]
- **Demo**: [Demo Link]
- **Discord**: [Contact Info]

---

🚀 **Built with ❤️ for the Cronos x402 Paytech Hackathon 2024**