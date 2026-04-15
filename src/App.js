import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import Dashboard from './components/Dashboard';

function App() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState("0");

  const handleConnect = (key, bal) => {
    setPublicKey(key);
    setBalance(Number(bal).toFixed(2));
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setPublicKey("");
    setBalance("0");
  };

  return (
    <>
      {!connected ? (
        <ConnectWallet onConnect={handleConnect} />
      ) : (
        <Dashboard 
          publicKey={publicKey} 
          initialBalance={balance} 
          onDisconnect={handleDisconnect} 
        />
      )}
    </>
  );
}

export default App;
