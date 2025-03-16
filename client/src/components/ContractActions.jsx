import React, { useEffect, useState } from "react";
import { depositFund, withdrawFund, getUserBalanceInETH, convertTokenToETH,getUserTokenBalance } from "../utils/contractServices";
import { toast } from "react-toastify";

function ContractActions() {
  const [amount, setAmount] = useState(""); // Input chung
  const [action, setAction] = useState("deposit");
  const [userBalance, setUserBalance] = useState("0");  
  const [convertAmount, setConvertAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0");
 
  // Cập nhật số dư user
  const updateUserBalance = async () => {
    try {
      const balance = await getUserBalanceInETH();
      setUserBalance(balance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };
  const updateTokenBalance = async () => {
    try {
      const balance = await getUserTokenBalance();
      if (balance !== undefined) {  // Kiểm tra tránh lỗi undefined
        console.log("Token Balance:", balance.toString());
        setTokenBalance(balance);
      } else {
        console.warn("Token balance is undefined, contract might not be initialized.");
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  useEffect(() => {
    updateUserBalance(); 
    updateTokenBalance(); 
    console.log("Token balance updated:", tokenBalance); // Cập nhật số dư khi component mount
  }, [tokenBalance]);

  const handleAction = async () => {
    try {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (action === "withdraw" && Number(amount) > Number(userBalance)) {
        toast.error("Not enough balance!");
        return;
      }
      
      if (action === "deposit") {
        await depositFund(amount.toString());
        toast.success(`Deposited ${amount} ETH successfully!`);
      } else {
        await withdrawFund(amount.toString());
        toast.success(`Withdrew ${amount} ETH successfully!`);
      }
      setAmount(""); // Reset input
      updateUserBalance(); 
    } catch (error) {
      const errorMessage = error?.data?.message || error?.reason || "Transaction failed";
      toast.error(errorMessage);
    }
  };

  // const handleConvert = async () => {
  //   try {
  //     if (!convertAmount || isNaN(convertAmount) || Number(convertAmount) <= 0) {
  //       toast.error("Please enter a valid amount");
  //       return;
  //     }
  //     if (Number(convertAmount) > Number(userBalance)) {
  //       toast.error("Not enough tokens!");
  //       return;
  //     }
      
  //     await convertTokenToETH(convertAmount.toString());
  //     toast.success(`Converted ${convertAmount} tokens to ETH in contract!`);
  //     setConvertAmount("");
  //     updateUserBalance();
  //     updateTokenBalance();
  //   } catch (error) {
  //     const errorMessage = error?.data?.message || error?.reason || "Conversion failed";
  //     toast.error(errorMessage);
  //   }
  // };
  const handleConvert = async () => {
    try {
      if (!convertAmount || isNaN(convertAmount) || Number(convertAmount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      console.log("Before Conversion - Token Balance:", tokenBalance.toString());
      
      await convertTokenToETH(convertAmount.toString());
      toast.success(`Converted ${convertAmount} tokens to ETH in contract!`);
      
      setConvertAmount("");
      updateTokenBalance();
      updateUserBalance();
    } catch (error) {
      const errorMessage = error?.data?.message || error?.reason || "Conversion failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h2>Contract Actions</h2>
      <p><strong>Your Balance:</strong> {userBalance} Token</p> 

      {/* Radio chọn hành động */}
      <div>
        <label>
          <input
            type="radio"
            value="deposit"
            checked={action === "deposit"}
            onChange={() => setAction("deposit")}
          />
          Deposit
        </label>
        <label>
          <input
            type="radio"
            value="withdraw"
            checked={action === "withdraw"}
            onChange={() => setAction("withdraw")}
          />
          Withdraw
        </label>
      </div>

      {/* Input chung */}
      <div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleAction}>
          {action === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
        </button>
      </div>
      
      {/* Convert Token -> ETH */}
      <h3>Convert Token to ETH</h3>
      <p><strong>Token Balance:</strong> {tokenBalance} Xu</p> 
      <input
        type="text"
        value={convertAmount}
        onChange={(e) => setConvertAmount(e.target.value)}
        placeholder="Enter token amount"
      />
      <button onClick={handleConvert}>Convert</button>
    </div>
  );
}

export default ContractActions;
