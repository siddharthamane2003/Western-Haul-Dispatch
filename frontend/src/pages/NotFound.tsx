import React from 'react'
import { Link } from 'react-router-dom'
import { Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-glow mb-6 animate-bounce">
        <Truck className="w-8 h-8 text-white" />
      </div>
      
      <h1
        className="text-4xl font-extrabold tracking-tight mb-2"
        style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
      >
        404 - Route Lost
      </h1>
      
      <p className="text-sm max-w-md mb-6" style={{ color: 'var(--text-muted)' }}>
        The page you are looking for has been dispatched to a different destination or does not exist.
      </p>

      <Link to="/dashboard">
        <Button variant="primary">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}
export { NotFound }
