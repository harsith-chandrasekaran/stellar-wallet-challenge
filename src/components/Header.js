import React, { useState } from "react";
import { checkConnection, getBalance, retreievePublicKey } from "./Freighter";

const Header = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState("0");

  const connectWallet = async () => {
    try {
      const allowed = await checkConnection();

      if (!allowed) return alert("Permission denied");

      const key = await retreievePublicKey();
      const bal = await getBalance();

      setPublicKey(key);
      setBalance(Number(bal).toFixed(2));
      setConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>Stellar dAppk</div>

      <div>
        {publicKey && (
          <>
            <div>{`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}</div>

            <div>Balance: {balance} XLM</div>
          </>
        )}

        <button onClick={connectWallet} disabled={connected}>
          {connected ? "Connected" : "Connect Wallet"}{" "}
        </button>
      </div>
    </div>
  );
};
export default Header;
