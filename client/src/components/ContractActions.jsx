import React, { useState } from "react";
import { depositFund, withdrawFund } from "../utils/contractServices";
import { getContractBalanceInETH } from "../utils/contractServices";

import { toast } from "react-toastify";

function ContractActions() {
  const [amount, setAmount] = useState(""); // Input chung
  const [action, setAction] = useState("deposit"); // Hành động mặc định là Deposit

  const handleAction = async () => {
    try {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (action === "withdraw") {
        const contractBalance = await getContractBalanceInETH();
        if (Number(amount) > Number(contractBalance)) {
          toast.error("Not enough ETH in contract!");
          return;
        }
      }

      if (action === "deposit") {
        await depositFund(amount.toString());
        toast.success(`Deposited ${amount} ETH successfully!`);
      } else {
        await withdrawFund(amount.toString());
        toast.success(`Withdrew ${amount} ETH successfully!`);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.reason || "Transaction failed";
      toast.error(errorMessage);
    }
    setAmount(""); // Reset input
  };

  return (
    <div>
      <h2>Contract Actions</h2>
      
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
    </div>
  );
}

export default ContractActions;
