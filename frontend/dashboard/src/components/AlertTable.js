import React from "react"

function AlertTable({ alerts }) {

  return (

    <table className="table table-sm">

      <thead>
        <tr>
          <th>Type</th>
          <th>Source IP</th>
          <th>Message</th>
        </tr>
      </thead>

      <tbody>

        {alerts.map((a,i)=>(
          <tr key={i}>
            <td>{a.type}</td>
            <td>{a.src_ip}</td>
            <td>{a.message}</td>
          </tr>
        ))}

      </tbody>

    </table>

  )

}

export default AlertTable