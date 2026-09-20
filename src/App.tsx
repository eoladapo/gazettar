import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import Category from "./pages/Category";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:slug" element={<ArticleDetail />} />
      <Route path="/category/:slug" element={<Category />} />
    </Routes>
  );
}

export default App;
