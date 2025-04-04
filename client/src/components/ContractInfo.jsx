import React, { useEffect, useState } from "react";
import { getContractBalanceInETH, getContractOwner,getUserBalanceInETH } from "../utils/contractServices";

function ContractInfo({ account }) {
  const [balance, setBalance] = useState(null);
  const [owner, setOwner] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        const balanceInETH = await getContractBalanceInETH();
        const ownerAddress = await getContractOwner();
        setBalance(balanceInETH);
        setOwner(ownerAddress);
        if (account) {
          const userBal = await getUserBalanceInETH();
          setUserBalance(userBal);
        }
      } catch (error) {
        console.error("Error fetching contract info:", error);
      }
    };
    
    fetchContractInfo();
  }, []);

  return (
    <div>
      <h2>Contract Balance: {balance} Token</h2>
      <p>Connected Account: {account}</p>
      <p>Contract Owner: {owner}</p>
      {/* <p><strong>Your Balance:</strong> {userBalance} ETH</p> */}
    </div>
  );
}

export default ContractInfo;
