import React, { useEffect, useState } from 'react'

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [])

  return (
    <div>
      {(typeof data.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Users</h1>
          <ul>
            {data.users.map((user) => {
              return (
                <li key={user}>{user}</li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App