import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import Lock_ABI from "./Lock_ABI.json";
import { CONTRACT_ADDRESS } from "./constants";

let provider;
let signer;
let contract;

// Hàm khởi tạo provider, signer, và contract
const initialize = async () => {
  if (typeof window.ethereum !== "undefined") {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, Lock_ABI, signer);
  } else {
    throw new Error("Please install MetaMask!");
  }
};

// Đảm bảo contract được khởi tạo trước khi dùng
const ensureInitialized = async () => {
  if (!provider || !signer || !contract) {
    await initialize();
  }
};

// Yêu cầu tài khoản từ MetaMask
export const requestAccount = async () => {
  try {
    await ensureInitialized();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0]; // Trả về địa chỉ tài khoản đầu tiên
  } catch (error) {
    console.error("Error requesting account:", error.message);
    return null;
  }
};

// Kiểm tra chủ sở hữu contract
// export const getContractOwner = async () => {
//   try {
//     await ensureInitialized();
//     const ownerAddress = await contract.owner();
//     return ownerAddress;
//   } catch (error) {
//     console.error("Error getting contract owner:", error.message);
//     return null;
//   }
// };
export const getContractOwner = async () => {
  try {
    await ensureInitialized();
    const ownerAddress = await contract.owner(); // Sửa từ contract.owner() thành contract.getOwner()
    return ownerAddress;
  } catch (error) {
    console.error("Error getting contract owner:", error.message);
    return null;
  }
};
export const getUserBalanceInETH = async () => {
  try {
    await ensureInitialized();
    const account = await requestAccount();
    if (!account) return "0";

    const balanceWei = await contract.getUserBalance(account);
    return formatEther(balanceWei);
  } catch (error) {
    console.error("Error getting user balance:", error.message);
    return "0";
  }
};

// Kiểm tra xem tài khoản hiện tại có phải là owner không
export const isOwner = async () => {
  try {
    const owner = await getContractOwner();
    const currentAccount = await requestAccount();

    return currentAccount?.toLowerCase() === owner?.toLowerCase();
  } catch (error) {
    console.error("Error checking ownership:", error.message);
    return false;
  }
};

// Lấy số dư của contract
export const getContractBalanceInETH = async () => {
  try {
    await ensureInitialized();
    const balanceWei = await provider.getBalance(CONTRACT_ADDRESS);
    return formatEther(balanceWei);
  } catch (error) {
    console.error("Error getting contract balance:", error.message);
    return "0";
  }
};

// Gửi ETH vào contract
export const depositFund = async (depositValue) => {
  try {
    await ensureInitialized();
    const ethValue = parseEther(depositValue);
    const deposit = await contract.deposit({ value: ethValue });
    await deposit.wait();
    console.log(`Deposited ${depositValue} ETH successfully`);
  } catch (error) {
    console.error("Error depositing funds:", error.message);
  }
};
export const convertTokenToETH = async (amount) => {
  await ensureInitialized();
  const account = await requestAccount();
  if (!account) throw new Error("No connected account!");

  const tx = await contract.convertTokenToETH(amount, { from: account });
  await tx.wait();
};

// Rút tiền từ contract
// export const withdrawFund = async (amount) => {
//   try {
//     await ensureInitialized();

//     if (!amount || isNaN(amount) || Number(amount) <= 0) {
//       throw new Error("Invalid withdrawal amount");
//     }

//     const amountInWei = parseEther(amount.toString());
//     console.log("Calling withdraw with amount:", amountInWei.toString());

//     const withdrawTx = await contract.withdraw(amountInWei);
//     await withdrawTx.wait();

//     console.log(`Successfully withdrew ${amount} ETH`);
//   } catch (error) {
//     console.error("Error withdrawing funds:", error.message);
//     throw error;
//   }
// };
export const withdrawFund = async (amount) => {
  try {
    await ensureInitialized();
    const account = await requestAccount();
    if (!account) throw new Error("No account connected!");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      throw new Error("Invalid withdrawal amount");
    }

    const amountInWei = parseEther(amount.toString());
    console.log("Calling withdraw with amount:", amountInWei.toString());

    const withdrawTx = await contract.withdraw(amountInWei);
    await withdrawTx.wait();

    console.log(`Successfully withdrew ${amount} ETH to ${account}`);
  } catch (error) {
    console.error("Error withdrawing funds:", error.message);
    throw error;
  }
};


export const getUserTokenBalance = async () => {
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts.length) throw new Error("No accounts found");

    const balance = await contract.methods.getUserTokenBalance(accounts[0]).call();
    // const balance = await contract.getUserTokenBalance(accounts[0]);
    return balance;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return "0";
  }
};

