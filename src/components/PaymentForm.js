import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendPayment } from "./Freighter";
import { motion } from "framer-motion";

export default function PaymentForm({ onPaymentSuccess }) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination || !amount) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPayment(destination, amount);
      setSuccess("Payment sent successfully!");
      setDestination("");
      setAmount("");
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (err) {
      console.error(err);
      
      let errMsg = "Transaction failed.";
      if (err.response?.data?.extras?.result_codes) {
        const codes = err.response.data.extras.result_codes;
        errMsg = codes.operations 
          ? `Operation failed: ${codes.operations.join(", ")}` 
          : `Transaction failed: ${codes.transaction}`;
      } else if (err.response?.data?.detail) {
          errMsg = err.response.data.detail;
      } else if (err.message) {
        errMsg = err.message;
      } else if (typeof err === "string") {
        errMsg = err;
      } else {
        errMsg = "Transaction failed. Make sure destination exists on Testnet.";
      }
      
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Send size={20} color="var(--primary)" />
        Send XLM
      </h3>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Destination Address
          </label>
          <input
            type="text"
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Amount (XLM)
          </label>
          <input
            type="number"
            step="0.0000001"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--danger)", fontSize: "0.875rem" }}>
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--success)", fontSize: "0.875rem" }}>
            {success}
          </motion.div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? <Loader2 className="spinner" size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Sign & Send"}
        </button>
      </form>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
