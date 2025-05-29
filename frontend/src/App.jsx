import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import { Routes, Route } from "react-router-dom"
import ProductPage from "./pages/ProductPage"
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const {theme} = useThemeStore()
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
};


export default App