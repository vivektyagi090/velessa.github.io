import React from 'react';
import { HashRouter, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/layout/Header';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { AppRoutes } from './routes/AppRoutes';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';
  const isShopkeeper = location.pathname.startsWith('/shopkeeper');
  const hideCustomerLayout = isCheckout || isShopkeeper;

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-charcoal font-sans selection:bg-champagne/20">
      {!hideCustomerLayout && <AnnouncementBar />}
      {!hideCustomerLayout && <Header />}
      
      <main className="flex-1 pb-24 lg:pb-0">
        <AppRoutes />
      </main>

      {!hideCustomerLayout && <Footer />}
      {!hideCustomerLayout && <MobileBottomNav />}
      <CartDrawer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;
