import React from 'react'

function MyBookings() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          My Bookings
        </h1>
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-400 mb-4">No bookings yet</h2>
          <p className="text-gray-500">Your movie bookings will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default MyBookings