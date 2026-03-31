import React from "react"

function severityColor(severity) {
  switch (severity) {
    case "CRITICAL":
      return "#ef4444"
    case "HIGH":
      return "#f97316"
    case "MEDIUM":
      return "#f59e0b"
    case "LOW":
      return "#3b82f6"
    default:
      return "#22c55e"
  }
}

function severityGlow(severity) {
  switch (severity) {
    case "CRITICAL":
      return "0 0 20px rgba(239,68,68,0.35)"
    case "HIGH":
      return "0 0 18px rgba(249,115,22,0.30)"
    case "MEDIUM":
      return "0 0 16px rgba(245,158,11,0.28)"
    case "LOW":
      return "0 0 14px rgba(59,130,246,0.25)"
    default:
      return "0 0 12px rgba(34,197,94,0.20)"
  }
}

function formatTimestampIST(timestamp) {
  if (!timestamp) return "N/A"

  try {
    const date = new Date(timestamp)

    const formatted = date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    })

    return `${formatted} IST`
  } catch {
    return timestamp
  }
}

function InfoCard({ title, children }) {
  return (
    <div
      className="card h-100 p-3 border-0"
      style={{
        background: "linear-gradient(145deg, #0f172a, #111827)",
        borderRadius: "18px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
      }}
    >
      <h6
        className="mb-3 fw-semibold"
        style={{ color: "#38bdf8", letterSpacing: "0.4px" }}
      >
        {title}
      </h6>
      <div style={{ color: "#e5e7eb", fontSize: "0.95rem", lineHeight: "1.8" }}>
        {children}
      </div>
    </div>
  )
}

function AnomalyDetails({ packet }) {
  if (!packet) return null

  const isAnomaly = packet.anomaly

  return (
    <div className="anomaly-details-wrapper">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h4
            className="mb-1 fw-bold"
            style={{
              color: "#f8fafc",
              letterSpacing: "0.4px"
            }}
          >
            {isAnomaly ? "Threat Investigation" : "Packet Inspection"}
          </h4>
          <p className="mb-0" style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Deep analysis of the selected network packet and its detection profile
          </p>
        </div>

        <span
          className="badge px-3 py-2"
          style={{
            backgroundColor: severityColor(packet.severity),
            color: "#fff",
            fontSize: "0.82rem",
            borderRadius: "999px",
            boxShadow: severityGlow(packet.severity),
            letterSpacing: "0.6px"
          }}
        >
          {isAnomaly ? `${packet.severity} THREAT` : "NORMAL"}
        </span>
      </div>

      {/* Main Grid */}
      <div className="row g-4">
        <div className="col-md-6">
          <InfoCard title="Packet Metadata">
            <p><b>Packet ID:</b> {packet.packet_id}</p>
            <p><b>Protocol:</b> {packet.protocol}</p>
            <p><b>Packet Length:</b> {packet.packet_length} bytes</p>
            <p><b>Status:</b> {isAnomaly ? "Anomaly Detected" : "Normal Traffic"}</p>
            <p><b>Severity:</b> {packet.severity || "NORMAL"}</p>
            <p><b>Timestamp:</b> {formatTimestampIST(packet.timestamp)}</p>
          </InfoCard>
        </div>

        <div className="col-md-6">
          <InfoCard title="Network Flow Details">
            <p><b>Source IP:</b> {packet.src_ip}</p>
            <p><b>Destination IP:</b> {packet.dst_ip}</p>
            <p><b>Source MAC:</b> {packet.src_mac || "N/A"}</p>
            <p><b>Destination MAC:</b> {packet.dst_mac || "N/A"}</p>
            <p><b>Destination Port:</b> {packet.dst_port ?? "N/A"}</p>
          </InfoCard>
        </div>

        <div className="col-12">
          <InfoCard title="Detection Insights">
            <p>
              <b>Attack Type:</b>{" "}
              <span style={{ color: severityColor(packet.severity), fontWeight: 600 }}>
                {packet.attack_type || "Normal Traffic"}
              </span>
            </p>

            <p>
              <b>Reason:</b>{" "}
              {packet.reason || "Traffic appears consistent with normal network behavior"}
            </p>

            {packet.ml_score !== null && packet.ml_score !== undefined ? (
              <p>
                <b>ML Score:</b>{" "}
                <span style={{ color: "#38bdf8", fontWeight: 600 }}>
                  {packet.ml_score}
                </span>
              </p>
            ) : (
              <p><b>ML Score:</b> N/A</p>
            )}

            <p><b>Connection Rate:</b> {packet.connection_rate ?? "N/A"}</p>
            <p><b>Unique Ports Accessed:</b> {packet.unique_ports ?? "N/A"}</p>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}

export default AnomalyDetails