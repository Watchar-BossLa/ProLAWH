
import { ethers } from "ethers";

// Polygon network configurations
const NETWORKS = {
  polygon_mainnet: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com"
  },
  polygon_mumbai: {
    chainId: 80001,
    name: "Polygon Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    blockExplorer: "https://mumbai.polygonscan.com"
  }
};

// Default to Mumbai testnet for development
const DEFAULT_NETWORK = "polygon_mumbai";

// ABI for the skill staking contract
const STAKING_ABI = [
  "function stake(uint256 skillId, uint256 amount) external returns (uint256)",
  "function withdraw(uint256 stakeId) external returns (bool)",
  "function getStake(uint256 stakeId) external view returns (address staker, uint256 skillId, uint256 amount, uint256 timestamp)",
  "function getStakesBySkill(uint256 skillId) external view returns (uint256[])",
  "function getStakesByUser(address user) external view returns (uint256[])",
  "event Staked(address indexed staker, uint256 indexed skillId, uint256 amount, uint256 stakeId)",
  "event Withdrawn(address indexed staker, uint256 indexed stakeId, uint256 amount)"
];

// Class for interacting with Polygon
export class PolygonClient {
  private provider: ethers.providers.JsonRpcProvider;
  private network: string;
  private signer: ethers.Signer | null = null;

  constructor(network = DEFAULT_NETWORK) {
    this.network = network;
    this.provider = new ethers.providers.JsonRpcProvider(NETWORKS[network as keyof typeof NETWORKS].rpcUrl);
  }

  // Connect wallet using MetaMask or other browser wallet
  async connectWallet() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("No wallet detected. Please install MetaMask or another Ethereum wallet.");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = provider.getSigner();
    return await this.signer.getAddress();
  }

  // Get contract instance
  getContract(contractAddress: string) {
    if (!this.signer) {
      throw new Error("Wallet not connected. Call connectWallet() first.");
    }
    return new ethers.Contract(contractAddress, STAKING_ABI, this.signer);
  }

  // Create a stake on a skill
  async createStake(contractAddress: string, skillId: string, amountUsdc: number) {
    const contract = this.getContract(contractAddress);
    
    // Convert USDC amount to Wei (assuming 6 decimal places for USDC)
    const amountInWei = ethers.utils.parseUnits(amountUsdc.toString(), 6);
    
    // Execute the transaction
    const tx = await contract.stake(skillId, amountInWei);
    return await tx.wait();
  }

  // Withdraw a stake
  async withdrawStake(contractAddress: string, stakeId: string) {
    const contract = this.getContract(contractAddress);
    const tx = await contract.withdraw(stakeId);
    return await tx.wait();
  }

  // Get transaction URL for block explorer
  getTransactionUrl(txHash: string) {
    const explorer = NETWORKS[this.network as keyof typeof NETWORKS].blockExplorer;
    return `${explorer}/tx/${txHash}`;
  }
}

// Create singleton instance
export const polygonClient = new PolygonClient();

// Type declarations for global window object with ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
