import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function AnalyticsWidget({ balance }) {
  const [historyData, setHistoryData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Fetch 7-day historical data
        const historyRes = await axios.get(
          "https://api.coingecko.com/api/v3/coins/stellar/market_chart?vs_currency=usd&days=7"
        );
        
        // Map timestamps to readable dates and prices
        const mappedData = historyRes.data.prices.map(([time, price]) => ({
          date: new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: price,
        }));
        setHistoryData(mappedData);

        // Fetch current price & 24h change
        const priceRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd&include_24hr_change=true"
        );
        
        const stellarData = priceRes.data.stellar;
        setCurrentPrice(stellarData.usd);
        setPriceChange(stellarData.usd_24h_change);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalValue = balance && currentPrice ? (parseFloat(balance) * currentPrice).toFixed(2) : "0.00";
  const isPositive = priceChange >= 0;

  if (loading) {
    return (
      <div className="glass-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minHeight: "350px", overflow: "hidden" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h3 style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            Total Worth (USD)
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <DollarSign size={28} color="var(--primary)" />
            <span style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.05em" }}>
              {totalValue}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "right", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Current XLM Price</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
            ${currentPrice.toFixed(4)}
            <span style={{ 
              fontSize: "0.875rem", 
              fontWeight: 500, 
              color: isPositive ? "var(--success)" : "var(--danger)",
              display: "flex",
              alignItems: "center"
            }}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: "250px", marginTop: "1rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={30} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${val.toFixed(3)}`} />
            <Tooltip
              contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "white" }}
              itemStyle={{ color: "var(--primary)", fontWeight: 600 }}
              labelStyle={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}
              formatter={(value) => [`$${value.toFixed(4)}`, "Price"]}
            />
            <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
