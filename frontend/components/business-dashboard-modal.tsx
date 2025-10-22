import { useState } from 'react';
import { Info, X, Leaf, CloudOff } from 'lucide-react';

export default function ImpactExplanationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
      {/* Demo Card with Modal Trigger */}
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Your impact</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-500 hover:text-[#00B14F] transition-colors"
            aria-label="Learn more about your impact"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">156 kg</div>
            <div className="text-sm text-gray-600">Food waste prevented</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">312 kg</div>
            <div className="text-sm text-gray-600">CO₂ emissions saved</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Understanding Your Impact</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Food Waste Section */}
              <div className="bg-green-50 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Food Waste Prevented</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Every meal you save from the bin
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  When businesses sell their surplus food through Qopchiq instead of throwing it away, 
                  we track the weight of food saved. Your <strong>156 kg</strong> represents all the meals 
                  and ingredients that found hungry customers instead of ending up in landfills.
                </p>
                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">💡 Did you know?</p>
                  <p className="text-xs text-gray-600 mt-1">
                    156 kg of food is approximately <strong>400+ meals</strong> saved from waste!
                  </p>
                </div>
              </div>

              {/* CO2 Emissions Section */}
              <div className="bg-blue-50 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <CloudOff className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">CO₂ Emissions Saved</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      The climate impact of your actions
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  When food waste decomposes in landfills, it releases methane and CO₂—powerful greenhouse gases. 
                  Your <strong>312 kg</strong> of CO₂ savings comes from preventing that decomposition and avoiding 
                  the emissions from producing replacement food.
                </p>
                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">🌍 For perspective:</p>
                  <p className="text-xs text-gray-600 mt-1">
                    312 kg CO₂ is equivalent to driving a car for <strong>1,300 km</strong> or 
                    charging <strong>38,000 smartphones</strong>!
                  </p>
                </div>
              </div>

              {/* How It's Calculated */}
              <div className="border-t pt-5">
                <h4 className="font-bold text-gray-900 mb-3">How we calculate this</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">1.</span>
                    <span>We track the weight of each surplus bag sold through your business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">2.</span>
                    <span>For CO₂, we multiply by 2x (standard food waste emission factor)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">3.</span>
                    <span>These metrics update in real-time as you make sales</span>
                  </li>
                </ul>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-center">
                <p className="text-white font-bold text-lg mb-2">Keep up the amazing work!</p>
                <p className="text-white/90 text-sm">
                  Every listing you create makes a real difference for our planet and community.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}