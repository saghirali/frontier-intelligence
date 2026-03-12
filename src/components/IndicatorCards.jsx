import { useState } from "react"
const formatGDP = (value) => {
  if (!value) return "N/A"
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  return `$${value.toFixed(2)}`
}

const Card = ({ title, value, unit, color, icon }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0d1220" : "#060912",
        border: `1px solid ${hovered ? color + "44" : color + "22"}`,
        borderTop: `3px solid ${color}`,
        borderRadius: "10px",
        padding: "18px",
        flex: "1",
        minWidth: "140px",
        transition: "all 0.2s",
        boxShadow: hovered ? `0 0 20px ${color}18` : "none",
        cursor: "default"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <p style={{ color: "#64748b", fontSize: "10px", letterSpacing: "1.5px", fontWeight: "600" }}>{title}</p>
        <span style={{ fontSize: "14px" }}>{icon}</span>
      </div>
      <p style={{ color: color, fontSize: "26px", fontWeight: "800", lineHeight: "1", letterSpacing: "-0.5px" }}>
        {value}
      </p>
      <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "8px", fontWeight: "400" }}>{unit}</p>
    </div>
  )
}

export default function IndicatorCards({ data }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "12px",
    }}>
      <Card title="GDP" value={formatGDP(data.gdp)} unit="Total Economy Size" color="#3b82f6" icon="💰" />
      <Card title="INFLATION" value={data.inflation ? `${data.inflation.toFixed(1)}%` : "N/A"} unit="Consumer Price Index" color="#f97316" icon="📈" />
      <Card title="UNEMPLOYMENT" value={data.unemployment ? `${data.unemployment.toFixed(1)}%` : "N/A"} unit="% of Labor Force" color="#22c55e" icon="👥" />
      <Card title="DEBT/GDP" value={data.debt ? `${data.debt.toFixed(1)}%` : "N/A"} unit="Government Debt Ratio" color="#a855f7" icon="🏦" />
    </div>
  )
}