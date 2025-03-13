import React, { useEffect, useState } from "react";
import { getContractBalanceInETH, getContractOwner } from "../utils/contractServices";

function ContractInfo({ account }) {
  const [balance, setBalance] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        const balanceInETH = await getContractBalanceInETH();
        const ownerAddress = await getContractOwner();
        setBalance(balanceInETH);
        setOwner(ownerAddress);
      } catch (error) {
        console.error("Error fetching contract info:", error);
      }
    };
    
    fetchContractInfo();
  }, []);

  return (
    <div>
      <h2>Contract Balance: {balance} ETH</h2>
      <p>Connected Account: {account}</p>
      <p>Contract Owner: {owner}</p>
    </div>
  );
}

export default ContractInfo;
