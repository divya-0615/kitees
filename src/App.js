import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import HomePage from "./Pages/Home";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import LoginPage from "./Authentication/LoginPage.jsx";
import SignupPage from "./Authentication/SignupPage.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./contexts/ScrollTop.jsx";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Toaster position="top-center" reverseOrder={false} />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/myorders" element={<MyOrders />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
