import React, { useEffect, useState, useRef } from "react"

function PacketStream() {

  const [packets, setPackets] = useState([])
  const wsRef = useRef(null)

  useEffect(() => {

    if (wsRef.current) return

    const ws = new WebSocket("ws://127.0.0.1:8000/ws/packets")

    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {

      const packet = JSON.parse(event.data)

      setPackets(prev => [packet, ...prev.slice(0, 20)])

    }

    ws.onerror = (err) => {
      console.error("WebSocket error:", err)
    }

    ws.onclose = () => {
      console.log("WebSocket closed")
    }

    return () => {
      ws.close()
      wsRef.current = null
    }

  }, [])

  return (

    <div className="card p-3">

      <h5>Live Packet Stream</h5>

      <table className="table table-sm">

        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th>Protocol</th>
            <th>Length</th>
          </tr>
        </thead>

        <tbody>

          {packets.length === 0 && (
            <tr>
              <td colSpan="4">Waiting for packets...</td>
            </tr>
          )}

          {packets.map((p, i) => (
            <tr key={i}>
              <td>{p.src_ip}</td>
              <td>{p.dst_ip}</td>
              <td>{p.protocol}</td>
              <td>{p.packet_length}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  )
}

export default PacketStream