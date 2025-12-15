// import { Outlet, Link, useLocation } from "react-router-dom";

// export default function Layout() {
//   const location = useLocation();
//   const showHero = location.pathname === "/";

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl px-8 py-4 bg-red-950/40 backdrop-blur-xl border border-red-500/20 rounded-full flex justify-between items-center z-50 shadow-2xl">
//         <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 uppercase tracking-wider">
//           MovieMate
//         </div>
//         <div className="flex gap-8 items-center">
//           <Link to="/" className="text-gray-300 text-sm font-medium hover:text-red-400 transition-colors">Home</Link>
//           <Link to="/recommendations" className="text-gray-300 text-sm font-medium hover:text-red-400 transition-colors">AI Picks ✨</Link>
//           <Link to="/add" className="px-6 py-2 bg-gradient-to-r from-red-700 to-red-900 rounded-full text-white text-sm font-bold shadow-lg hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all">
//             + Add Content
//           </Link>
//         </div>
//       </nav>

//       {/* 🚨 FIXED: Removed 'mb-12' from className below.
//          Now the Home component (which is black) will touch this image directly.
//       */}
//       {showHero && (
//         <header className="relative h-[70vh] w-full bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center flex items-end">
//           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0000] via-red-950/10 to-transparent"></div>
//           <div className="relative z-10 px-[5%] pb-16 max-w-4xl">
//             <span className="inline-block px-4 py-1 mb-4 rounded-full border border-red-500/50 bg-red-500/10 text-red-300 text-xs font-bold backdrop-blur-md">
//               #1 Trending in AI Recommendations
//             </span>
//             <h1 className="text-6xl font-black mb-4 leading-none text-white drop-shadow-lg">
//               Your Ultimate<br />Masterpieces
//             </h1>
//             <p className="text-red-100/70 text-lg font-light">
//               Curated by your personal AI assistant based on your viewing history.
//             </p>
//           </div>
//         </header>
//       )}

//       <main>
//         <Outlet />
//       </main>
//     </>
//   );
// }

import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const showHero = location.pathname === "/";

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl px-8 py-4 bg-red-950/40 backdrop-blur-xl border border-red-500/20 rounded-full flex justify-between items-center z-50 shadow-2xl transition-all duration-300 hover:border-red-500/40">
        
        {/* LOGO (Now acts as Home Link with Glow Effect) */}
        <Link to="/" className="group relative">
            <div className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 group-hover:to-red-400 transition-all duration-300 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              MovieMate
            </div>
            {/* Staggered Glow Layer */}
            <div className="absolute inset-0 text-2xl font-black uppercase tracking-widest text-red-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300 -z-10">
              MovieMate
            </div>
        </Link>

        {/* Navigation Links (Home removed) */}
        <div className="flex gap-8 items-center">
          
          <Link to="/recommendations" className="text-gray-300 text-sm font-medium hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-all">
            Top Picks ✨
          </Link>
          
          <Link to="/add" className="px-6 py-2 bg-gradient-to-r from-red-700 to-red-900 rounded-full text-white text-sm font-bold shadow-lg hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-transparent hover:border-red-400/30">
            + Add Content
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      {showHero && (
        <header className="relative h-[70vh] w-full bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center flex items-end">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0000] via-red-950/10 to-transparent"></div>
          <div className="relative z-10 px-[5%] pb-16 max-w-4xl">
            <span className="inline-block px-4 py-1 mb-4 rounded-full border border-red-500/50 bg-red-500/10 text-red-300 text-xs font-bold backdrop-blur-md shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              #1 Trending in AI Recommendations
            </span>
            <h1 className="text-6xl font-black mb-4 leading-none text-white drop-shadow-2xl">
              Your Ultimate<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">Masterpieces</span>
            </h1>
            <p className="text-red-100/70 text-lg font-light max-w-2xl">
              Curated by your personal AI assistant based on your viewing history.
            </p>
          </div>
        </header>
      )}

      <main>
        <Outlet />
      </main>
    </>
  );
}