// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import AddContent from "./pages/AddContent";
// import Details from "./pages/Details";
// import Recommendations from "./pages/Recommendations";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/add" element={<AddContent />} />
//       <Route path="/content/:id" element={<Details />} />
//       <Route path="/recommendations" element={<Recommendations />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom"; // REMOVED BrowserRouter import
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AddContent from "./pages/AddContent";
import Details from "./pages/Details";
import Recommendations from "./pages/Recommendations";

function App() {
  return (
    // NO <BrowserRouter> here! It is already in main.jsx
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddContent />} />
        <Route path="/content/:id" element={<Details />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Route>
    </Routes>
  );
}

export default App;