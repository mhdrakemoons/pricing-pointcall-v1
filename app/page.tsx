import PricingTable from '@/components/PricingTable';
import { pricingData } from '@/data/pricing-data';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-[700px] h-[700px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-[95vw] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <PricingTable data={pricingData} />
        </div>
      </main>
    </div>
  );
}
