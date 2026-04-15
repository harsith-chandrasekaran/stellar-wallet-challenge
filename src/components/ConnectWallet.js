import React from "react";
import { motion } from "framer-motion";
import { Wallet, Sparkles } from "lucide-react";
import { checkConnection, retreievePublicKey, getBalance } from "./Freighter";

export default function ConnectWallet({ onConnect }) {
  const handleConnect = async () => {
    try {
      const allowed = await checkConnection();
      if (!allowed) {
        alert("Permission denied. Please allow Freighter to connect.");
        return;
      }
      const key = await retreievePublicKey();
      const bal = await getBalance();
      onConnect(key, bal);
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card"
        style={{
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{
          display: "inline-flex",
          padding: "1rem",
          borderRadius: "20px",
          background: "rgba(99, 102, 241, 0.1)",
          color: "var(--primary)",
          marginBottom: "1.5rem"
        }}>
          <Wallet size={48} />
        </div>
        
        <h1 style={{ marginBottom: "0.5rem", fontSize: "2rem" }}>Stellar Gateway</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.5 }}>
          Connect your Freighter wallet to explore a fast and secure payment experience.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
          style={{ width: "100%", padding: "1rem" }}
        >
          <Sparkles size={20} />
          Connect Freighter
        </motion.button>
      </motion.div>
    </div>
  );
}
