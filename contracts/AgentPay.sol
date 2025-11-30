// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AgentPay
 * @dev AI-powered payment automation platform with x402 integration
 * @notice Smart contract for automated AI agent triggered payments on Cronos
 */
contract AgentPay is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Structs for payment data
    struct PaymentIntent {
        bytes32 id;
        address payer;
        address recipient;
        uint256 amount;
        address token;
        string condition;
        bool active;
        uint256 timestamp;
        uint256 executionTime;
        bool executed;
        uint256 gasLimit;
    }

    struct AICondition {
        bytes32 id;
        string description;
        address aiAgent;
        bool active;
        uint256 createdTime;
    }

    // State variables
    mapping(bytes32 => PaymentIntent) public paymentIntents;
    mapping(bytes32 => AICondition) public aiConditions;
    mapping(address => uint256) public agentNonces;

    bytes32[] public activePaymentIds;
    bytes32[] public activeConditionIds;

    address public x402Facilitator;
    address public supportedToken;
    uint256 public minPaymentAmount;
    uint256 public maxGasLimit;

    // Events
    event PaymentIntentCreated(
        bytes32 indexed intentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        address token,
        string condition
    );

    event AIConditionCreated(
        bytes32 indexed conditionId,
        string description,
        address indexed aiAgent
    );

    event PaymentExecuted(
        bytes32 indexed intentId,
        address indexed executor,
        uint256 amount,
        uint256 gasUsed
    );

    event PaymentCancelled(bytes32 indexed intentId, address indexed canceller);

    // Modifiers
    modifier validIntent(bytes32 _intentId) {
        require(_intentId != bytes32(0), "AgentPay: Invalid intent ID");
        require(paymentIntents[_intentId].active, "AgentPay: Intent not active");
        _;
    }

    modifier validCondition(bytes32 _conditionId) {
        require(_conditionId != bytes32(0), "AgentPay: Invalid condition ID");
        require(aiConditions[_conditionId].active, "AgentPay: Condition not active");
        _;
    }

    modifier onlyValidAgent(address _aiAgent) {
        require(_aiAgent != address(0), "AgentPay: Invalid agent address");
        require(agentNonces[_aiAgent] > 0, "AgentPay: Agent not registered");
        _;
    }

    constructor(
        address _x402Facilitator,
        address _supportedToken,
        uint256 _minPaymentAmount,
        uint256 _maxGasLimit
    ) Ownable() {
        x402Facilitator = _x402Facilitator;
        supportedToken = _supportedToken;
        minPaymentAmount = _minPaymentAmount;
        maxGasLimit = _maxGasLimit;
    }

    /**
     * @dev Register an AI agent for payment execution
     * @param _aiAgent The address of the AI agent
     */
    function registerAgent(address _aiAgent) external onlyOwner {
        require(_aiAgent != address(0), "AgentPay: Invalid agent address");
        if (agentNonces[_aiAgent] == 0) {
            agentNonces[_aiAgent] = 1;
        }
    }

    /**
     * @dev Create a payment intent with AI condition
     * @param _recipient Payment recipient address
     * @param _amount Payment amount in token units
     * @param _token Token address (use address(0) for native CRO)
     * @param _condition AI condition description
     * @param _executionTime Optional execution timestamp (0 for immediate when condition met)
     */
    function createPaymentIntent(
        address _recipient,
        uint256 _amount,
        address _token,
        string calldata _condition,
        uint256 _executionTime
    ) external payable nonReentrant returns (bytes32) {
        require(_recipient != address(0), "AgentPay: Invalid recipient");
        require(_amount >= minPaymentAmount, "AgentPay: Amount below minimum");

        bytes32 intentId = _generateIntentId(msg.sender, block.timestamp);

        // For native CRO payments, ensure sufficient value is sent
        if (_token == address(0)) {
            require(msg.value >= _amount, "AgentPay: Insufficient CRO sent");
        } else {
            require(msg.value == 0, "AgentPay: CRO sent for token payment");
        }

        paymentIntents[intentId] = PaymentIntent({
            id: intentId,
            payer: msg.sender,
            recipient: _recipient,
            amount: _amount,
            token: _token,
            condition: _condition,
            active: true,
            timestamp: block.timestamp,
            executionTime: _executionTime,
            executed: false,
            gasLimit: maxGasLimit
        });

        activePaymentIds.push(intentId);

        // If token payment, transfer to this contract for escrow
        if (_token != address(0)) {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        }

        emit PaymentIntentCreated(intentId, msg.sender, _recipient, _amount, _token, _condition);
        return intentId;
    }

    /**
     * @dev Create an AI condition that can trigger payments
     * @param _description Human-readable condition description
     * @param _aiAgent AI agent responsible for evaluating condition
     */
    function createAICondition(
        string calldata _description,
        address _aiAgent
    ) external onlyOwner returns (bytes32) {
        require(_aiAgent != address(0), "AgentPay: Invalid agent address");

        bytes32 conditionId = _generateConditionId(_aiAgent, block.timestamp);

        aiConditions[conditionId] = AICondition({
            id: conditionId,
            description: _description,
            aiAgent: _aiAgent,
            active: true,
            createdTime: block.timestamp
        });

        activeConditionIds.push(conditionId);

        // Auto-register agent if not already registered
        if (agentNonces[_aiAgent] == 0) {
            agentNonces[_aiAgent] = 1;
        }

        emit AIConditionCreated(conditionId, _description, _aiAgent);
        return conditionId;
    }

    /**
     * @dev Execute payment using AI agent verification
     * @param _intentId Payment intent ID to execute
     * @param _conditionId Condition ID that triggered execution
     * @param _proof Data/proof from AI agent showing condition is met
     */
    function executePaymentWithAI(
        bytes32 _intentId,
        bytes32 _conditionId,
        bytes calldata _proof
    ) external validIntent(_intentId) validCondition(_conditionId) nonReentrant {
        PaymentIntent storage intent = paymentIntents[_intentId];
        AICondition storage condition = aiConditions[_conditionId];

        require(msg.sender == condition.aiAgent, "AgentPay: Only authorized AI agent");
        require(!intent.executed, "AgentPay: Payment already executed");

        // Check execution time constraints
        if (intent.executionTime > 0) {
            require(block.timestamp >= intent.executionTime, "AgentPay: Execution time not reached");
        }

        intent.executed = true;
        intent.active = false;

        // Remove from active payments
        _removeActivePayment(_intentId);

        // Execute payment
        uint256 gasUsed = gasleft();
        if (intent.token == address(0)) {
            // Native CRO payment
            payable(intent.recipient).transfer(intent.amount);
        } else {
            // ERC20 token payment
            IERC20(intent.token).safeTransfer(intent.recipient, intent.amount);
        }

        // Update agent nonce for replay protection
        agentNonces[condition.aiAgent]++;

        emit PaymentExecuted(_intentId, msg.sender, intent.amount, gasUsed);
    }

    /**
     * @dev Cancel a payment intent (only payer or owner)
     * @param _intentId Payment intent ID to cancel
     */
    function cancelPaymentIntent(bytes32 _intentId) external validIntent(_intentId) {
        PaymentIntent storage intent = paymentIntents[_intentId];
        require(msg.sender == intent.payer || msg.sender == owner(), "AgentPay: Unauthorized");

        intent.active = false;
        _removeActivePayment(_intentId);

        // Return funds if in escrow
        if (intent.token != address(0)) {
            IERC20(intent.token).safeTransfer(intent.payer, intent.amount);
        } else {
            payable(intent.payer).transfer(intent.amount);
        }

        emit PaymentCancelled(_intentId, msg.sender);
    }

    /**
     * @dev Batch execute multiple payments
     * @param _intentIds Array of payment intent IDs
     * @param _conditionIds Array of corresponding condition IDs
     * @param _proofs Array of proofs from AI agents
     */
    function batchExecutePayments(
        bytes32[] calldata _intentIds,
        bytes32[] calldata _conditionIds,
        bytes[] calldata _proofs
    ) external nonReentrant {
        require(_intentIds.length == _conditionIds.length, "AgentPay: Array length mismatch");
        require(_intentIds.length == _proofs.length, "AgentPay: Array length mismatch");

        for (uint256 i = 0; i < _intentIds.length; i++) {
            if (paymentIntents[_intentIds[i]].active && !paymentIntents[_intentIds[i]].executed) {
                this.executePaymentWithAI(_intentIds[i], _conditionIds[i], _proofs[i]);
            }
        }
    }

    // View functions
    function getActivePayments() external view returns (bytes32[] memory) {
        return activePaymentIds;
    }

    function getActiveConditions() external view returns (bytes32[] memory) {
        return activeConditionIds;
    }

    function getPaymentIntent(bytes32 _intentId) external view returns (PaymentIntent memory) {
        return paymentIntents[_intentId];
    }

    function getAICondition(bytes32 _conditionId) external view returns (AICondition memory) {
        return aiConditions[_conditionId];
    }

    // Owner functions
    function updateSettings(
        address _x402Facilitator,
        address _supportedToken,
        uint256 _minPaymentAmount,
        uint256 _maxGasLimit
    ) external onlyOwner {
        x402Facilitator = _x402Facilitator;
        supportedToken = _supportedToken;
        minPaymentAmount = _minPaymentAmount;
        maxGasLimit = _maxGasLimit;
    }

    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        if (_token == address(0)) {
            payable(owner()).transfer(_amount);
        } else {
            IERC20(_token).safeTransfer(owner(), _amount);
        }
    }

    // Internal functions
    function _generateIntentId(address _payer, uint256 _timestamp) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_payer, _timestamp, block.prevrandao, agentNonces[_payer]));
    }

    function _generateConditionId(address _aiAgent, uint256 _timestamp) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_aiAgent, _timestamp, block.prevrandao, agentNonces[_aiAgent]));
    }

    function _removeActivePayment(bytes32 _intentId) internal {
        uint256 length = activePaymentIds.length;
        for (uint256 i = 0; i < length; i++) {
            if (activePaymentIds[i] == _intentId) {
                activePaymentIds[i] = activePaymentIds[length - 1];
                activePaymentIds.pop();
                break;
            }
        }
    }

    // Fallback to receive native CRO
    receive() external payable {}
}