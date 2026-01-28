import { useState } from 'react';
import { Info, X, Leaf, CloudOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyProducts } from '@/api/services/products';

export default function ImpactExplanationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['business-products'],
    queryFn: fetchMyProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate impact metrics from actual product data
  const calculateImpact = () => {
    if (!products || products.length === 0) {
      return { foodWaste: 0, co2Saved: 0, mealsSaved: 0 };
    }

    const totalWeight = products.reduce((sum, product) => {
      const weight = product.quantity.amount;
      const unit = product.quantity.unit;
      
      // Convert to kg for consistent calculation
      let weightInKg = weight;
      if (unit === 'g') weightInKg = weight / 1000;
      else if (unit === 'ml') weightInKg = weight / 1000; // Assuming 1ml = 1g for liquids
      else if (unit === 'l') weightInKg = weight;
      else if (unit === 'pcs') weightInKg = weight * 0.5; // Estimate 0.5kg per piece
      
      return sum + (weightInKg * product.stock);
    }, 0);

    const foodWaste = Math.round(totalWeight);
    const co2Saved = Math.round(foodWaste * 2); // Standard 2x multiplier for CO2
    const mealsSaved = Math.round(foodWaste * 2.5); // Estimate 2.5 meals per kg

    return { foodWaste, co2Saved, mealsSaved };
  };

  const { foodWaste, co2Saved, mealsSaved } = calculateImpact();

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
      {/* Dynamic Card with Modal Trigger */}
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
            <div className="text-2xl font-bold text-gray-900">{foodWaste} kg</div>
            <div className="text-sm text-gray-600">Food waste prevented</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{co2Saved} kg</div>
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
                  we track the weight of food saved. Your <strong>{foodWaste} kg</strong> represents all the meals 
                  and ingredients that found hungry customers instead of ending up in landfills.
                </p>
                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">💡 Did you know?</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {foodWaste} kg of food is approximately <strong>{mealsSaved}+ meals</strong> saved from waste!
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
                  Your <strong>{co2Saved} kg</strong> of CO₂ savings comes from preventing that decomposition and avoiding 
                  the emissions from producing replacement food.
                </p>
                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">🌍 For perspective:</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {co2Saved} kg CO₂ is equivalent to driving a car for <strong>{Math.round(co2Saved * 4.2)} km</strong> or 
                    charging <strong>{Math.round(co2Saved * 122)} smartphones</strong>!
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