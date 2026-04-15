import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Wallet, Activity } from "lucide-react";
import PaymentForm from "./PaymentForm";
import HistoryList from "./HistoryList";
import AnalyticsWidget from "./AnalyticsWidget";
import { getBalance } from "./Freighter";

export default function Dashboard({ publicKey, initialBalance, onDisconnect }) {
  const [balance, setBalance] = useState(initialBalance);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePaymentSuccess = async () => {
    // Refresh balance and history after successful payment
    try {
      const newBal = await getBalance();
      setBalance(Number(newBal).toFixed(2));
      setRefreshTrigger(prev => prev + 1);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "var(--primary)", padding: "0.5rem", borderRadius: "10px" }}>
            <Activity size={24} color="white" />
          </div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
        </div>
        
        <button className="secondary" onClick={onDisconnect} style={{ padding: "0.5rem 1rem" }}>
          <LogOut size={16} /> Disconnect
        </button>
      </motion.header>

      {/* Main Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
        style={{ marginBottom: "2rem", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Wallet size={16} /> Total Balance
          </div>
          <div style={{ fontSize: "3rem", fontWeight: 700, letterSpacing: "-0.05em", color: "var(--text-main)" }}>
            {balance} <span style={{ fontSize: "1.5rem", color: "var(--primary)", fontWeight: 500 }}>XLM</span>
          </div>
          
          <div style={{ marginTop: "1rem", display: "inline-block", background: "rgba(255,255,255,0.05)", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.875rem", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            Address: <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{publicKey.slice(0, 8)}...{publicKey.slice(-8)}</span>
          </div>
        </div>

        {/* Decorative blur */}
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "300px", height: "300px", background: "var(--primary)", opacity: 0.1, filter: "blur(60px)", borderRadius: "50%" }} />
      </motion.div>

      {/* Analytics Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        style={{ marginBottom: "2rem" }}
      >
        <AnalyticsWidget balance={balance} />
      </motion.div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HistoryList publicKey={publicKey} refreshTrigger={refreshTrigger} />
        </motion.div>
      </div>

    </div>
  );
}
