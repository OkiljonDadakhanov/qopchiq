"use client"

export function TipsSection() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Good to Know</h2>
      <p className="text-sm text-gray-600 mb-4">
        See how to use Qopchiq with ease
      </p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-yellow-100 rounded-3xl p-6 border-2 border-dashed border-yellow-300 hover:bg-yellow-50 transition-colors cursor-pointer">
          <p className="text-sm font-bold mb-2">Get to know</p>
          <p className="text-sm font-bold mb-4">Qopchiq better</p>
          <div className="text-4xl">🥗</div>
        </div>
        <div className="bg-gray-100 rounded-3xl p-6 border-2 border-dashed border-gray-300 cursor-not-allowed">
          <p className="text-sm text-gray-400 font-bold mb-2">New tips</p>
          <p className="text-sm text-gray-400 font-bold mb-4">coming soon!</p>
          <div className="text-4xl opacity-30">⭐</div>
        </div>
      </div>
    </div>
  )
}