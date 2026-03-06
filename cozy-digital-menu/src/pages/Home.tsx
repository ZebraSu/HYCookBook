import { Menu as MenuIcon, Search, ArrowRight, Home as HomeIcon, UtensilsCrossed, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <header className="flex items-center p-4 justify-between sticky top-0 z-10 bg-background-light">
        <button className="flex size-12 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <MenuIcon className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Welcome</h2>
        <button className="flex size-12 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full mt-4">
        {/* Hero Image */}
        <div className="w-full aspect-square max-w-[320px] mx-auto bg-white rounded-full overflow-hidden mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center relative">
          <img 
            alt="Minimalist food illustration" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgirSlCv_htEYOF2JeIR5AhGQF1J1XINPa66VW9tPS2sjVx7Htzn8dUZj2BlOl1rEyJea_3p2vvsyUBpaW85sHH02hnCKPyerllOkey5h1P1R5lkcVeLwwFy0_BTyi9PVYIX6yk16pdnWPN3r37WmnNhUIvjjio2k4UncVxE_9rmSLBXwLyy4Sj23r9ljVixd3Ogkfx_X3lJ6FYXaFkoN9mmuXs_jBeWCvr0j1qe7RAeFPb9yKi9_QHHj4K5IWMgD10TOq-Wz9ug"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        </div>

        {/* Greeting */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight">Welcome to Our Kitchen</h1>
          <p className="text-text-muted text-base leading-relaxed px-4">
            Discover our premium, cozy personal digital menu with warm, delicious offerings.
          </p>
        </div>

        {/* CTA Button */}
        <Link 
          to="/menu"
          className="w-full max-w-[280px] bg-primary hover:bg-primary/90 text-white text-lg font-bold py-4 px-8 rounded-full shadow-[0_8px_20px_rgba(234,199,174,0.4)] transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          Go to Menu
          <ArrowRight className="w-5 h-5" />
        </Link>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-black/5 pb-safe pt-2 px-4 z-50">
        <div className="flex max-w-md mx-auto gap-2 pb-2">
          <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary rounded-xl py-2 hover:bg-primary/10 transition-colors">
            <HomeIcon className="w-6 h-6 fill-primary" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Home</span>
          </Link>
          <Link to="/menu" className="flex flex-1 flex-col items-center justify-end gap-1 text-text-muted rounded-xl py-2 hover:bg-black/5 transition-colors">
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-wide uppercase">Menu</span>
          </Link>
          <Link to="#" className="flex flex-1 flex-col items-center justify-end gap-1 text-text-muted rounded-xl py-2 hover:bg-black/5 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium tracking-wide uppercase">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
