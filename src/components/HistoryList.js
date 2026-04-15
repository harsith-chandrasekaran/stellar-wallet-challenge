import React, { useEffect, useState } from "react";
import { fetchHistory } from "./Freighter";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Clock, History } from "lucide-react";

export default function HistoryList({ publicKey, refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const records = await fetchHistory();
        setHistory(records);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    if (publicKey) loadData();
  }, [publicKey, refreshTrigger]);

  if (loading) {
    return (
      <div className="glass-card" style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
        <Clock style={{ animation: "spin 2s linear infinite", color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ height: "100%", maxHeight: "500px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <History size={20} color="var(--primary)" />
        Recent Transactions
      </h3>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingRight: "0.5rem" }}>
        {history.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", marginTop: "2rem" }}>No recent history found.</p>
        ) : (
          history.map((record, idx) => {
            const isSent = record.from === publicKey;
            const amount = record.amount || "0";
            
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ 
                    padding: "0.5rem", 
                    borderRadius: "8px", 
                    background: isSent ? "rgba(244, 63, 94, 0.1)" : "rgba(16, 185, 129, 0.1)",
                    color: isSent ? "var(--danger)" : "var(--success)"
                  }}>
                    {isSent ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                      {isSent ? "Sent XLM" : "Received XLM"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  fontWeight: 600,
                  color: isSent ? "var(--text-main)" : "var(--success)"
                }}>
                  {isSent ? "-" : "+"}{parseFloat(amount).toFixed(2)}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
