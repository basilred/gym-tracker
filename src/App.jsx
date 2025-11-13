import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubscriptionPage from "./pages/SubscriptionPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/gym-tracker/'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscription/:id" element={<SubscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
