import { ChevronLeft, Search, Star, UtensilsCrossed, CakeSlice, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const DISHES = [
  {
    id: 1,
    name: 'Truffle Risotto',
    description: 'Arborio rice, black truffle, rich parmesan cheese',
    price: '$24.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0BlUs3IJI-2tX6w8bd2e44uQZ_L1wwQJ3h3TCPZuJbeVICYsQBZiluIcKQlEgVuiCtY_WNtLYtAZW2AwsAP_MNfEm484oLK1ln0lV03ELxGF1w5gL31HkqJXmp0IhBtA_XjQEk0hz__qnkeQs3p0mPdJZbkZMO2HDn-Tp88vlqVlkOz0bMYBfC0p_dQcw4pQu-fX2stNAcbJR9R7qYgPdA4SuHqmgCOR2TtNDDH175Ni6UeqRukLY-uyQ6WRaIVULD7ldeiUacg'
  },
  {
    id: 2,
    name: 'Matcha Mille Crepe',
    description: '20 delicate layers with fresh Hokkaido cream',
    price: '$12.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-U3XX0-RrU8mRxBWuT2sF-xU3lwnwiNAxbFgOWBbO3fX1VBzs-HKMsWlg4npHebIae9J7w9BeM1bVUPLSghabv0t3LK2xPDpjrpItLGdH4dL7nyH17vwKcnlTE0b_HHkQ3QqnZJyeV7EaL9aHE1P7yFDA7yK88JdzNSs1_O0tj53FYjY9JUZpahPX8TfVcqPbI7C4L-9TxvrqCnyOLFUPiKJPjBOFKGK6Gcf4cWGNahrvLKH7o0catZDz0KfL7hKpSV1SwimpKQ'
  },
  {
    id: 3,
    name: 'Rose Latte',
    description: 'Premium espresso, steamed milk, delicate rose syrup',
    price: '$7.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKFacFgPY-svHn6y1IADkIp6dvWzjuTGgxspcmZ3lts6Us95qRGNDhMQgcPnczLUwE-XbkDu21q17OaO0VriOrS5p4SXJQeC3U_i1SO7ZOnXmLIxumbk0MYnJ_Bq2cjERHp17tvd50ABxFsvvR0fCtFWuk1QKYUxAZ3k7uAZLz0PYlH1HD-oZ3Rmm5yccY0AKY5urla9P_oFaUoXUQNY2_ypwDUVyaNAvyAyKFh2Z6wjoO239VezjGDtLKlz3zE1DaKMIf7BZfdg'
  }
];

export default function Menu() {
  return (
    <div className="flex flex-col h-screen bg-background-light text-coffee overflow-hidden relative">
      {/* TopAppBar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-primary/20">
        <Link to="/" className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Our Menu</h2>
        <button className="flex w-12 items-center justify-end">
          <Search className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-24 shrink-0 bg-white/50 border-r border-primary/10 overflow-y-auto no-scrollbar">
          <nav className="flex flex-col py-4 gap-2">
            <button className="relative flex flex-col items-center justify-center py-4 px-2 group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pistachio rounded-r-full"></div>
              <div className="bg-pistachio/20 p-3 rounded-2xl mb-1">
                <Star className="w-6 h-6 text-coffee fill-coffee" />
              </div>
              <span className="text-xs font-bold text-coffee">Signature</span>
            </button>
            
            <button className="relative flex flex-col items-center justify-center py-4 px-2 group opacity-60 hover:opacity-100 transition-opacity">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-transparent rounded-r-full group-hover:bg-pistachio/50 transition-colors"></div>
              <div className="bg-transparent group-hover:bg-pistachio/10 p-3 rounded-2xl mb-1 transition-colors">
                <UtensilsCrossed className="w-6 h-6 text-tea" />
              </div>
              <span className="text-xs font-medium text-tea">Appetizers</span>
            </button>

            <button className="relative flex flex-col items-center justify-center py-4 px-2 group opacity-60 hover:opacity-100 transition-opacity">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-transparent rounded-r-full group-hover:bg-pistachio/50 transition-colors"></div>
              <div className="bg-transparent group-hover:bg-pistachio/10 p-3 rounded-2xl mb-1 transition-colors">
                <UtensilsCrossed className="w-6 h-6 text-tea" />
              </div>
              <span className="text-xs font-medium text-tea">Mains</span>
            </button>

            <button className="relative flex flex-col items-center justify-center py-4 px-2 group opacity-60 hover:opacity-100 transition-opacity">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-transparent rounded-r-full group-hover:bg-pistachio/50 transition-colors"></div>
              <div className="bg-transparent group-hover:bg-pistachio/10 p-3 rounded-2xl mb-1 transition-colors">
                <CakeSlice className="w-6 h-6 text-tea" />
              </div>
              <span className="text-xs font-medium text-tea">Desserts</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2">Signature Dishes</h3>
            
            {DISHES.map((dish) => (
              <div key={dish.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] justify-between border border-transparent items-center">
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-[84px] shadow-sm" 
                    style={{ backgroundImage: `url(${dish.image})` }}
                  ></div>
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <p className="text-base font-bold leading-tight">{dish.name}</p>
                    <p className="text-tea text-xs font-medium leading-snug line-clamp-2">{dish.description}</p>
                    <p className="text-coffee text-sm font-bold mt-1">{dish.price}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-20">
        <ShoppingBag className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 bg-pistachio text-coffee text-[10px] font-bold size-5 rounded-full flex items-center justify-center border-2 border-background-light">
          2
        </div>
      </button>
    </div>
  );
}
