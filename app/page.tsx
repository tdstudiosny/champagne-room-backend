'use client'

import { useState } from 'react'
import Dashboard from './components/Dashboard'

export default function Home() {
  const [user] = useState({
    id: 1,
    name: 'Tyler Davis',
    email: 'tyler@tdstudiosny.com',
    role: 'CEO',
    company: 'TD Studios NY'
  })

  const handleLogout = () => {
    // Optional logout functionality - just refresh for now
    window.location.reload()
  }

  return (
    <Dashboard user={user} onLogout={handleLogout} />
  )
}
