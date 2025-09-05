// /DaSpCoRate/frontend/src/App.jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 p-4 rounded-lg shadow-md">
        Willkommen bei der Tanzsport-App (React mit Tailwind)!
      </h1>
    </div>
  )
}

export default App