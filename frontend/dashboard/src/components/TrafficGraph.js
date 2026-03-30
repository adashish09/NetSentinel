import React, { useEffect, useState, useRef } from "react"
import {
  Line
} from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

function TrafficGraph() {
  const [labels, setLabels] = useState([])
  const [packetData, setPacketData] = useState([])
  const [anomalyData, setAnomalyData] = useState([])

  const packetBuffer = useRef([])
  const anomalyBuffer = useRef([])

  useEffect(() => {

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    ws.onmessage = (event) => {
      const packet = JSON.parse(event.data)

      packetBuffer.current.push(1)

      if (packet.anomaly) {
        anomalyBuffer.current.push(1)
      }
    }

    // Update every second
    const interval = setInterval(() => {

      const now = new Date().toLocaleTimeString()

      const packetCount = packetBuffer.current.length
      const anomalyCount = anomalyBuffer.current.length

      packetBuffer.current = []
      anomalyBuffer.current = []

      setLabels(prev => [...prev, now].slice(-60))
      setPacketData(prev => [...prev, packetCount].slice(-60))
      setAnomalyData(prev => [...prev, anomalyCount].slice(-60))

    }, 1000)

    return () => {
      ws.close()
      clearInterval(interval)
    }

  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: "Packets/sec",
        data: packetData,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3
      },
      {
        label: "Anomalies/sec",
        data: anomalyData,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" }
      },
      y: {
        ticks: { color: "#9ca3af" }
      }
    }
  }

  return (
    <div className="card p-3">
      <h5>📊 Network Traffic (Live)</h5>
      <Line data={data} options={options} />
    </div>
  )
}

export default TrafficGraph