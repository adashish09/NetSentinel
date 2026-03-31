import React, { useEffect, useState } from "react"
import API from "../services/api"

function getThreatLevel(score) {
  if (score >= 80) return { label: "Critical", color: "#ef4444" }
  if (score >= 60) return { label: "High", color: "#f97316" }
  if (score >= 40) return { label: "Elevated", color: "#eab308" }
  if (score >= 20) return { label: "Guarded", color: "#3b82f6" }
  return { label: "Stable", color: "#22c55e" }
}

function ThreatScoreCard() {
  const [score, setScore] = useState(0)
  const [lastAlert, setLastAlert] = useState("No recent threats")

  useEffect(() => {
    let interval

    async function loadThreatScore() {
      try {
        const threatRes = await API.get("/threat-score")
        setScore(threatRes.data.score || 0)

        const alertsRes = await API.get("/alerts")
        if (alertsRes.data.length > 0) {
          const latest = alertsRes.data[0]
          setLastAlert(`${latest.src_ip || "Unknown"} • ${latest.severity || latest.type || "Alert"}`)
        } else {
          setLastAlert("No recent threats")
        }
      } catch (error) {
        console.error("Failed to load threat score:", error)
      }
    }

    loadThreatScore()
    interval = setInterval(loadThreatScore, 3000)

    return () => clearInterval(interval)
  }, [])

  const threat = getThreatLevel(score)

  return (
    <div className="card summary-card threat-score-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="summary-label mb-0">Threat Score</h6>
        <span
          className="badge"
          style={{
            backgroundColor: threat.color,
            color: "#fff",
            fontSize: "0.72rem"
          }}
        >
          {threat.label}
        </span>
      </div>

      <div className="d-flex align-items-end justify-content-between">
        <h2
          className="summary-value mb-0"
          style={{
            color: threat.color,
            fontSize: "2rem"
          }}
        >
          {score}
          <span style={{ fontSize: "1rem", color: "#94a3b8" }}>/100</span>
        </h2>
      </div>

      <div
        style={{
          height: "1px",
          background: "#1e293b",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "1px"
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: threat.color,
            transition: "width 0.5s ease"
          }}
        />
      </div>

      <small
        style={{
          color: "#94a3b8",
          fontSize: "0.72rem",
          marginTop: "1px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
        title={lastAlert}
      >
        Last: {lastAlert}
      </small>
    </div>
  )
}

export default ThreatScoreCard