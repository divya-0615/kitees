import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext.jsx";
import HomePage from "./Pages/HomePage.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
