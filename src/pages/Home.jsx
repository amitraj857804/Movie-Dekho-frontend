import React from 'react'
import MovieCarousel from '../components/MovieCarousel'
import TrendingMovies from '../components/TrendingMovies'

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 custom-scrollbar">
      {/* Hero Section with Movie Carousel */}
      <section className="relative">
        
        <MovieCarousel />
      </section>
      
      {/* Trending Movies Section */}
      <TrendingMovies />
      
      {/* Additional content section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Welcome to Movie Dekho
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Discover the latest movies, book your tickets, and enjoy an amazing cinematic experience. 
            Our platform brings you the best of entertainment with seamless booking and exclusive offers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Latest Movies</h3>
              <p className="text-gray-400">Watch the newest releases in stunning quality</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-400">Book your seats with just a few clicks</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Best Experience</h3>
              <p className="text-gray-400">Premium sound and visual experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home