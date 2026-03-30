import React, { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

function ProtocolChart() {
  const [protocolCounts, setProtocolCounts] = useState({
    TCP: 0,
    UDP: 0,
    ICMP: 0,
    Other: 0
  })

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data)

      setProtocolCounts(prev => {
        const updated = { ...prev }

        if (packet.protocol === "TCP") updated.TCP += 1
        else if (packet.protocol === "UDP") updated.UDP += 1
        else if (packet.protocol === "ICMP") updated.ICMP += 1
        else updated.Other += 1

        return updated
      })
    }

    return () => ws.close()
  }, [])

  const total =
    protocolCounts.TCP +
    protocolCounts.UDP +
    protocolCounts.ICMP +
    protocolCounts.Other

  const data = {
    labels: ["TCP", "UDP", "ICMP", "Other"],
    datasets: [
      {
        data: [
          protocolCounts.TCP,
          protocolCounts.UDP,
          protocolCounts.ICMP,
          protocolCounts.Other
        ],
        backgroundColor: [
          "#38bdf8",
          "#22c55e",
          "#f59e0b",
          "#ef4444"
        ],
        borderColor: "#0f172a",
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e5e7eb",
          padding: 20,
          font: {
            size: 13
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0
            return `${context.label}: ${value} packets (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="card p-3 h-100 d-flex flex-column">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">📊 Protocol Distribution</h5>
        <span className="badge bg-info text-dark">
          {total} Packets
        </span>
      </div>

      <div style={{ height: "300px" }}>
        <Doughnut data={data} options={options} />
      </div>

    </div>
  )
}

export default ProtocolChart