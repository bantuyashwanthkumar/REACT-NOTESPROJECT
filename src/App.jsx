import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {

  const [saman, setsaman] = useState([])
  const [showJson, setShowJson] = useState(false)
  const [page, setPage] = useState(1)


  const userdata = async () => {
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=12`)
      setsaman(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  // Automatically fetch data when page changes
  useEffect(() => {
    userdata()
  }, [page])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(saman, null, 2))
    alert("JSON copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30">
      {/* Header section */}
      <div className="flex flex-col items-center justify-center py-12 px-4 border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-5xl font-black mb-6 bg-linear-to-r from-yellow-400 via-amber-500 to-orange-600 bg-clip-text text-transparent italic tracking-tighter">
          Image Explorer
        </h1>
        <div className="flex gap-4">
          <button
            onClick={userdata}
            className='group relative bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-full text-black font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] active:scale-95 transition-all duration-300 overflow-hidden'
          >
            <span className="relative z-10 flex items-center gap-2">
              Refresh Data
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {saman.length > 0 && (
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors border border-zinc-700"
            >
              {showJson ? "Show Gallery" : "View Raw JSON"}
            </button>
          )}
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {!showJson ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {saman.map((item) => (
                <div
                  key={item.id}
                  className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-zinc-800">
                    <img
                      src={item.download_url}
                      alt={item.author}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-yellow-500 uppercase tracking-wider">ID: {item.id}</span>
                    </div>
                    <p className="text-lg font-semibold text-zinc-100 truncate group-hover:text-yellow-400 transition-colors">
                      {item.author}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                      >
                        View Source →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {saman.length > 0 && (
              <div className="mt-16 flex items-center justify-center gap-8">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className={`bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg`}
                >
                  Prev
                </button>
                <span className="text-2xl font-bold text-white tracking-widest">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-400">Raw Data (JSON Stringified)</h2>
              <button
                onClick={copyToClipboard}
                className="text-xs bg-zinc-800 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors border border-zinc-700 hover:text-black"
              >
                Copy JSON
              </button>
            </div>
            <pre className="text-yellow-500 font-mono text-xs sm:text-sm overflow-x-auto p-6 bg-black/50 rounded-2xl max-h-[600px] scrollbar-thin scrollbar-thumb-zinc-800">
              {JSON.stringify(saman, null, 2)}
            </pre>
          </div>
        )}

        {saman.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-zinc-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl font-light">No images loaded yet. Click the button above.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App