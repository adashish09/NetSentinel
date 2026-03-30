import React from "react"

function severityColor(severity) {
  switch (severity) {
    case "CRITICAL":
      return "#f81f1f"
    case "HIGH":
      return "#ff6a00"
    case "MEDIUM":
      return "#fa8500"
    default:
      return "#3b82f6"
  }
}

function AnomalyDetails({ packet }) {
  if (!packet) return null

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1" style={{color: "#38bdf8"}}>
            {packet.anomaly ? "Packet Analysis" : "Packet Inspection"}
          </h4>
          <p className="text-secondary mb-0">
            Detailed analysis of selected network packet
          </p>
        </div>

        <span
          className="badge"
          style={{
            backgroundColor: severityColor(packet.severity),
            color: "#fff",
            fontSize: "0.9rem"
          }}
        >
          {packet.anomaly ? `${packet.severity} THREAT` : "NORMAL"}
        </span>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="text-info">Packet Information</h6>
            <p><b>Packet ID:</b> {packet.packet_id}</p>
            <p><b>Protocol:</b> {packet.protocol}</p>
            <p><b>Length:</b> {packet.packet_length} bytes</p>
            <p><b>Status:</b> {packet.anomaly ? "Anomaly" : "Normal"}</p>
            <p><b>Severity:</b> {packet.severity || "LOW"}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="text-info">Network Flow</h6>
            <p><b>Source IP:</b> {packet.src_ip}</p>
            <p><b>Destination IP:</b> {packet.dst_ip}</p>
            <p><b>Source MAC:</b> {packet.src_mac || "N/A"}</p>
            <p><b>Destination MAC:</b> {packet.dst_mac || "N/A"}</p>
          </div>
        </div>

        <div className="col-12">
          <div className="card p-3">
            <h6 className="mb-3 text-info">Detection Insights</h6>
            <p><b>Reason:</b> {packet.anomaly_reason || "Normal traffic pattern"}</p>
            <p><b>ML Score:</b> {packet.ml_score !== undefined ? packet.ml_score : "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnomalyDetails