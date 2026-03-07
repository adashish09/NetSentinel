import React, { useEffect, useState } from "react"
import API from "../services/api"
import AlertTable from "../components/AlertTable"

function Alerts() {

  const [alerts, setAlerts] = useState([])

  useEffect(() => {

    async function loadAlerts() {

      const res = await API.get("/alerts")

      setAlerts(res.data)

    }

    loadAlerts()

  }, [])

  return (

    <div className="container mt-4">

      <h2>Security Alerts</h2>

      <div className="card p-3">

        <AlertTable alerts={alerts} />

      </div>

    </div>

  )

}

export default Alerts