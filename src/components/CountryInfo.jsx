export default function CountryInfo({ country }) {
  return (
    <div style={{
      background: "#1a1a2e",
      border: "1px solid #333",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "24px"
    }}>
      <img
        src={`https://flagcdn.com/w80/${country.flag}.png`}
        alt={country.name}
        style={{ width: "80px", borderRadius: "6px", border: "1px solid #333" }}
      />
      <div>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>
          {country.name}
        </h2>
        <p style={{ color: "#888", fontSize: "14px" }}>
          🏛️ Capital: <span style={{ color: "#ccc" }}>{country.capital}</span>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          🌍 Region: <span style={{ color: "#ccc" }}>{country.region}</span>
        </p>
      </div>
    </div>
  )
}