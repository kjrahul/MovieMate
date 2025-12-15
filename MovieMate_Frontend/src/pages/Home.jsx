// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getAllContent } from "../api/contentApi";

// export default function Home() {
//   const [contentList, setContentList] = useState([]);
//   const [filter, setFilter] = useState("all"); // 'all', 'watching', 'wishlist', 'completed'

//   useEffect(() => {
//     getAllContent()
//       .then((res) => setContentList(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   // --- FILTER LOGIC ---
//   const filteredItems = contentList.filter((item) => {
//     const status = (item.status || "").toLowerCase();
//     if (filter === "all") return true;
//     if (filter === "completed") return status === "completed" || status === "finished";
//     return status === filter;
//   });

//   const getValidImage = (item) => {
//     const link = item.poster_url || item.imageUrl || item.image_url;
//     if (link && link.startsWith("http")) return link;
//     return "https://placehold.co/300x450/1a1a1a/e50914?text=No+Image"; 
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0000] text-white font-sans overflow-x-hidden pb-12">
      
//       <div className="px-[5%] pt-24 md:pt-8">

//         {/* --- FILTER TABS --- */}
//         <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
//           {["all", "watching", "wishlist", "completed"].map((type) => (
//             <button
//               key={type}
//               onClick={() => setFilter(type)}
//               className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border
//                 ${filter === type 
//                   ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
//                   : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
//                 }`}
//             >
//               {type === "all" ? "All Content" : type}
//             </button>
//           ))}
//         </div>

//         {/* --- GRID DISPLAY --- */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-fade-in-up">
//           {filteredItems.map((item) => (
//             <div key={item.id} className="group relative bg-[#120505] rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-[2/3] cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-red-900/20 hover:border-red-500/40">
              
//               {/* Status Badge */}
//               <span className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md z-20 border shadow-lg
//                 ${(item.status || "").toLowerCase() === 'watching' ? 'bg-black/80 text-red-500 border-red-600' : 
//                   (item.status || "").toLowerCase() === 'completed' ? 'bg-black/80 text-green-400 border-green-500' : 
//                   'bg-black/80 text-yellow-400 border-yellow-500'}`}>
//                 {item.status || "Pending"}
//               </span>

//               <img 
//                 src={getValidImage(item)} 
//                 alt={item.title} 
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-110"
//               />

//               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col justify-end p-5">
//                 <h3 className="text-xl font-bold text-white mb-1 leading-tight">{item.title}</h3>
//                 <p className="text-xs text-red-300/80 mb-4 font-medium">{item.genre || "Genre"}</p>
//                 <Link to={`/content/${item.id}`} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-lg text-center shadow-lg transition-colors">
//                   View Details
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredItems.length === 0 && (
//            <div className="text-center py-20 opacity-50">
//                <p className="text-xl text-gray-500">No content found in "{filter}".</p>
//                <button onClick={() => setFilter('all')} className="text-red-500 hover:underline mt-2">View All</button>
//            </div>
//         )}

//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllContent } from "../api/contentApi";

// Helper function to get unique list of Genres or Platforms
const getUniqueFilters = (list, key) => {
  const uniqueItems = new Set(list.map(item => item[key]).filter(Boolean));
  return ["All", ...Array.from(uniqueItems).sort()];
};

export default function Home() {
  const [contentList, setContentList] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'watching', 'wishlist', 'completed'
  
  // ✅ NEW STATES for Genre and Platform filtering
  const [genreFilter, setGenreFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const [uniqueGenres, setUniqueGenres] = useState(["All"]);
  const [uniquePlatforms, setUniquePlatforms] = useState(["All"]);

  // --- Initial Data Fetch ---
  useEffect(() => {
    getAllContent()
      .then((res) => {
        const data = res.data || [];
        setContentList(data);
        
        // Dynamically set filter options after fetching data
        setUniqueGenres(getUniqueFilters(data, 'genre'));
        setUniquePlatforms(getUniqueFilters(data, 'platform'));
      })
      .catch((err) => console.error("Failed to fetch content:", err));
  }, []);

  // --- COMBINED FILTER LOGIC (Status, Genre, Platform) ---
  const filteredItems = contentList.filter((item) => {
    const status = (item.status || "").toLowerCase();
    
    // 1. Status Filter
    let statusMatch = false;
    if (filter === "all") {
      statusMatch = true;
    } else if (filter === "completed") {
      statusMatch = status === "completed" || status === "finished";
    } else {
      statusMatch = status === filter;
    }

    // 2. Genre Filter
    const genreMatch = genreFilter === "All" || item.genre === genreFilter;

    // 3. Platform Filter
    const platformMatch = platformFilter === "All" || item.platform === platformFilter;

    return statusMatch && genreMatch && platformMatch;
  });

  const getValidImage = (item) => {
    const link = item.poster_url || item.imageUrl || item.image_url;
    if (link && link.startsWith("http")) return link;
    return "https://placehold.co/300x450/1a1a1a/e50914?text=No+Image"; 
  };

  return (
    <div className="min-h-screen bg-[#0a0000] text-white font-sans overflow-x-hidden pb-12">
      
      <div className="px-[5%] pt-24 md:pt-8">

        <h1 className="text-4xl font-black text-white mb-6 pt-4">Your Content List</h1>

        {/* --- CONSOLIDATED FILTER/SORT BAR (NEW) --- */}
        <div className="bg-[#120505] border border-white/10 rounded-xl p-4 mb-8 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-bold text-gray-400 mr-2">Filter By:</span>
          
          {/* Genre Dropdown */}
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-red-500 focus:border-red-500"
          >
            {uniqueGenres.map(g => (
              <option key={g} value={g}>{g === "All" ? "All Genres" : g}</option>
            ))}
          </select>

          {/* Platform Dropdown */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-red-500 focus:border-red-500"
          >
            {uniquePlatforms.map(p => (
              <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>
            ))}
          </select>
        </div>

        {/* --- STATUS FILTER TABS (EXISTING) --- */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
          {["all", "watching", "wishlist", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border
                ${filter === type 
                  ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                  : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              {type === "all" ? "All Content" : type}
            </button>
          ))}
        </div>

        {/* --- GRID DISPLAY --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-fade-in-up">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative bg-[#120505] rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-[2/3] cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-red-900/20 hover:border-red-500/40">
              
              {/* Status Badge */}
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md z-20 border shadow-lg
                ${(item.status || "").toLowerCase() === 'watching' ? 'bg-black/80 text-red-500 border-red-600' : 
                  (item.status || "").toLowerCase() === 'completed' ? 'bg-black/80 text-green-400 border-green-500' : 
                  'bg-black/80 text-yellow-400 border-yellow-500'}`}>
                {item.status || "Pending"}
              </span>

              {/* Image */}
              <img 
                src={getValidImage(item)} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-110"
              />

              {/* Hover Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col justify-end p-5">
                <h3 className="text-xl font-bold text-white mb-1 leading-tight">{item.title}</h3>
                
                {/* Display Genre & Platform on card */}
                <p className="text-xs text-red-300/80 mb-1 font-medium">{item.genre || "Genre"}</p>
                <p className="text-xs text-gray-400/80 mb-4 font-medium">{item.platform || "Platform"}</p>
                
                <Link to={`/content/${item.id}`} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-lg text-center shadow-lg transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
           <div className="text-center py-20 opacity-50">
               <p className="text-xl text-gray-500">No content found matching the selected filters.</p>
               <button onClick={() => { setFilter('all'); setGenreFilter('All'); setPlatformFilter('All'); }} className="text-red-500 hover:underline mt-2">Clear Filters</button>
           </div>
        )}

      </div>
    </div>
  );
}