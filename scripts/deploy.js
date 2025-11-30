/**
 * Deployment script for AgentPay smart contracts
 */

const { ethers } = require("hardhat");

async function main() {
  console.log("Starting AgentPay deployment to Cronos...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Deploy X402Facilitator first
  console.log("\n1. Deploying X402Facilitator...");
  const X402Facilitator = await ethers.getContractFactory("X402Facilitator");
  const x402Facilitator = await X402Facilitator.deploy();
  await x402Facilitator.waitForDeployment();
  const x402Address = await x402Facilitator.getAddress();
  console.log("X402Facilitator deployed to:", x402Address);

  // Get a supported token address (using USDC on Cronos testnet as example)
  const supportedToken = "0x7097c4b89e722540c921b78c1f6a4c5f8c5b1b2e"; // Example USDC address
  const minPaymentAmount = ethers.parseEther("0.1"); // 0.1 CRO minimum
  const maxGasLimit = 1000000;

  // Deploy AgentPay
  console.log("\n2. Deploying AgentPay...");
  const AgentPay = await ethers.getContractFactory("AgentPay");
  const agentPay = await AgentPay.deploy(
    x402Address,
    supportedToken,
    minPaymentAmount,
    maxGasLimit
  );
  await agentPay.waitForDeployment();
  const agentPayAddress = await agentPay.getAddress();
  console.log("AgentPay deployed to:", agentPayAddress);

  // Configure X402Facilitator to point to AgentPay
  console.log("\n3. Configuring X402Facilitator...");
  await x402Facilitator.setAgentPayContract(agentPayAddress);

  // Set authorized relayers (deployer as initial relayer)
  await x402Facilitator.setAuthorizedRelayer(deployer.address, true);

  // Register a test AI agent
  console.log("\n4. Registering AI agent...");
  await agentPay.registerAgent(deployer.address);

  // Deployment summary
  console.log("\n🎉 Deployment Complete!");
  console.log("=================================");
  console.log("Network:", network.name);
  console.log("Deployer:", deployer.address);
  console.log("\nDeployed Contracts:");
  console.log("X402Facilitator:", x402Address);
  console.log("AgentPay:", agentPayAddress);
  console.log("\nConfiguration:");
  console.log("Supported Token:", supportedToken);
  console.log("Min Payment Amount:", ethers.formatEther(minPaymentAmount), "CRO");
  console.log("Max Gas Limit:", maxGasLimit);

  // Verify contracts if on testnet
  if (network.name === "cronosTestnet") {
    console.log("\n⚠️  Remember to verify contracts on Cronos Explorer:");
    console.log(`X402Facilitator: https://testnet.cronoscan.com/address/${x402Address}`);
    console.log(`AgentPay: https://testnet.cronoscan.com/address/${agentPayAddress}`);
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      X402Facilitator: x402Address,
      AgentPay: agentPayAddress
    },
    config: {
      supportedToken,
      minPaymentAmount: ethers.formatEther(minPaymentAmount),
      maxGasLimit
    }
  };

  // Write deployment info to file
  const fs = require("fs");
  fs.writeFileSync(
    `./deployment-${network.name}-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📄 Deployment info saved to deployment file");

  return deploymentInfo;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });