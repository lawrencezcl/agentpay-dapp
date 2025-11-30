// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title X402Facilitator
 * @dev x402 payment facilitator for Cronos ecosystem
 * @notice Enables sponsored transactions and programmatic payment flows
 */
contract X402Facilitator is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Structs
    struct Sponsor {
        address sponsor;
        uint256 totalDeposit;
        uint256 activeUsage;
        bool isActive;
        uint256 createdTime;
    }

    struct SponsoredTransaction {
        bytes32 id;
        address user;
        address sponsor;
        uint256 gasLimit;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        bytes data;
        bool executed;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => Sponsor) public sponsors;
    mapping(bytes32 => SponsoredTransaction) public sponsoredTransactions;
    mapping(address => bool) public authorizedRelayers;
    mapping(address => uint256) public userNonces;

    // Arrays
    bytes32[] public pendingTransactions;

    // State variables
    address public agentPayContract;
    uint256 public minSponsorBalance = 1 ether;
    uint256 public maxGasPrice = 100 gwei;
    uint256 public sponsorshipExpiryTime = 24 hours;

    // Events
    event SponsorRegistered(address indexed sponsor, uint256 amount);
    event SponsorshipUpdated(address indexed sponsor, uint256 newBalance);
    event TransactionSponsored(bytes32 indexed txId, address indexed user, address indexed sponsor);
    event TransactionExecuted(bytes32 indexed txId, address indexed executor, uint256 gasUsed);
    event SponsorshipCancelled(address indexed sponsor);

    // Modifiers
    modifier onlyAuthorizedRelayer() {
        require(authorizedRelayers[msg.sender], "X402Facilitator: Unauthorized relayer");
        _;
    }

    modifier validSponsor(address _sponsor) {
        require(sponsors[_sponsor].isActive, "X402Facilitator: Invalid sponsor");
        _;
    }

    modifier validTransaction(bytes32 _txId) {
        require(!sponsoredTransactions[_txId].executed, "X402Facilitator: Transaction already executed");
        _;
    }

    constructor() Ownable() {}

    /**
     * @dev Register as a sponsor for x402 transactions
     */
    function registerSponsor() external payable {
        require(msg.value >= minSponsorBalance, "X402Facilitator: Insufficient sponsor balance");

        if (sponsors[msg.sender].createdTime == 0) {
            sponsors[msg.sender] = Sponsor({
                sponsor: msg.sender,
                totalDeposit: msg.value,
                activeUsage: 0,
                isActive: true,
                createdTime: block.timestamp
            });
        } else {
            sponsors[msg.sender].totalDeposit += msg.value;
            sponsors[msg.sender].isActive = true;
        }

        emit SponsorRegistered(msg.sender, msg.value);
    }

    /**
     * @dev Add more funds to sponsorship pool
     */
    function addToSponsorship() external payable validSponsor(msg.sender) {
        require(msg.value > 0, "X402Facilitator: No funds provided");
        sponsors[msg.sender].totalDeposit += msg.value;
        emit SponsorshipUpdated(msg.sender, sponsors[msg.sender].totalDeposit);
    }

    /**
     * @dev Sponsor a transaction for a user
     */
    function sponsorTransaction(
        address _user,
        uint256 _gasLimit,
        uint256 _maxFeePerGas,
        uint256 _maxPriorityFeePerGas,
        bytes calldata _data
    ) external validSponsor(msg.sender) nonReentrant returns (bytes32) {
        require(_gasLimit <= 1000000, "X402Facilitator: Gas limit too high");
        require(_maxFeePerGas <= maxGasPrice, "X402Facilitator: Gas price too high");

        uint256 estimatedCost = _gasLimit * _maxFeePerGas;
        require(sponsors[msg.sender].totalDeposit >= sponsors[msg.sender].activeUsage + estimatedCost,
                "X402Facilitator: Insufficient sponsor balance");

        bytes32 txId = _generateTransactionId(_user, block.timestamp);

        sponsoredTransactions[txId] = SponsoredTransaction({
            id: txId,
            user: _user,
            sponsor: msg.sender,
            gasLimit: _gasLimit,
            maxFeePerGas: _maxFeePerGas,
            maxPriorityFeePerGas: _maxPriorityFeePerGas,
            data: _data,
            executed: false,
            timestamp: block.timestamp
        });

        pendingTransactions.push(txId);
        sponsors[msg.sender].activeUsage += estimatedCost;

        emit TransactionSponsored(txId, _user, msg.sender);
        return txId;
    }

    /**
     * @dev Execute sponsored transaction (only authorized relayers)
     */
    function executeSponsoredTransaction(
        bytes32 _txId
    ) external onlyAuthorizedRelayer validTransaction(_txId) nonReentrant {
        SponsoredTransaction storage transaction = sponsoredTransactions[_txId];
        Sponsor storage sponsor = sponsors[transaction.sponsor];

        require(block.timestamp <= transaction.timestamp + sponsorshipExpiryTime,
                "X402Facilitator: Transaction expired");

        transaction.executed = true;

        // Remove from pending transactions
        _removePendingTransaction(_txId);

        // Calculate actual gas cost
        uint256 gasUsed = gasleft();
        uint256 gasCost = gasUsed * transaction.maxFeePerGas;

        // Ensure sponsor has sufficient balance
        require(sponsor.totalDeposit >= sponsor.activeUsage + gasCost,
                "X402Facilitator: Insufficient sponsor balance");

        // Execute the transaction (this would typically call the target contract)
        (bool success, ) = address(agentPayContract).call(transaction.data);
        require(success, "X402Facilitator: Transaction execution failed");

        // Update sponsor balances
        sponsor.activeUsage += gasCost;
        userNonces[transaction.user]++;

        emit TransactionExecuted(_txId, msg.sender, gasUsed);
    }

    /**
     * @dev Set authorized relayers
     */
    function setAuthorizedRelayer(address _relayer, bool _authorized) external onlyOwner {
        authorizedRelayers[_relayer] = _authorized;
    }

    /**
     * @dev Set AgentPay contract address
     */
    function setAgentPayContract(address _agentPay) external onlyOwner {
        agentPayContract = _agentPay;
    }

    /**
     * @dev Update configuration
     */
    function updateConfiguration(
        uint256 _minSponsorBalance,
        uint256 _maxGasPrice,
        uint256 _sponsorshipExpiryTime
    ) external onlyOwner {
        minSponsorBalance = _minSponsorBalance;
        maxGasPrice = _maxGasPrice;
        sponsorshipExpiryTime = _sponsorshipExpiryTime;
    }

    /**
     * @dev Cancel sponsorship and withdraw remaining funds
     */
    function cancelSponsorship() external validSponsor(msg.sender) {
        Sponsor storage sponsor = sponsors[msg.sender];
        uint256 refundAmount = sponsor.totalDeposit - sponsor.activeUsage;

        sponsor.isActive = false;
        sponsor.totalDeposit = sponsor.activeUsage;

        if (refundAmount > 0) {
            payable(msg.sender).transfer(refundAmount);
        }

        emit SponsorshipCancelled(msg.sender);
    }

    /**
     * @dev Emergency withdrawal by owner
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "X402Facilitator: Insufficient contract balance");
        payable(owner()).transfer(_amount);
    }

    // View functions
    function getSponsor(address _sponsor) external view returns (Sponsor memory) {
        return sponsors[_sponsor];
    }

    function getSponsoredTransaction(bytes32 _txId) external view returns (SponsoredTransaction memory) {
        return sponsoredTransactions[_txId];
    }

    function getPendingTransactions() external view returns (bytes32[] memory) {
        return pendingTransactions;
    }

    function getUserNonce(address _user) external view returns (uint256) {
        return userNonces[_user];
    }

    // Internal functions
    function _generateTransactionId(address _user, uint256 _timestamp) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_user, _timestamp, block.prevrandao, userNonces[_user]));
    }

    function _removePendingTransaction(bytes32 _txId) internal {
        uint256 length = pendingTransactions.length;
        for (uint256 i = 0; i < length; i++) {
            if (pendingTransactions[i] == _txId) {
                pendingTransactions[i] = pendingTransactions[length - 1];
                pendingTransactions.pop();
                break;
            }
        }
    }

    // Fallback to receive native CRO
    receive() external payable {}
}