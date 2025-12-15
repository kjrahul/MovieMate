// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createContent } from "../api/contentApi";
// import { searchTMDB, getTMDBDetails } from "../api/tmdbApi";

// export default function AddContent() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     content_type: "movie",
//     director: "",
//     genre: "",
//     platform: "",
//     status: "watching",
//     total_episodes: "",
//     episodes_watched: 0,
//     poster_url: "",
//     overview: "",
//   });

//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // 🔍 TMDB Search
//   const handleFetchFromTMDB = () => {
//     if (!formData.title) return;

//     setLoading(true);
//     searchTMDB(formData.title, formData.content_type)
//       .then((res) => setSearchResults(res.data))
//       .finally(() => setLoading(false));
//   };

//   // 📥 Select TMDB result
//   const handleSelectTMDB = (item) => {
//     setLoading(true);
//     getTMDBDetails(item.id, formData.content_type)
//       .then((res) => {
//         setFormData((prev) => ({
//           ...prev,
//           title: res.data.title,
//           director: res.data.director || "",
//           genre: res.data.genres || "",
//           overview: res.data.overview || "",
//           poster_url: res.data.poster_url || "",
//           total_episodes:
//             formData.content_type === "tv" ? res.data.total_episodes : "",
//         }));
//         setSearchResults([]);
//       })
//       .finally(() => setLoading(false));
//   };

//   // ✅ Submit
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       total_episodes:
//         formData.content_type === "tv" ? Number(formData.total_episodes) : null,
//       episodes_watched:
//         formData.content_type === "tv" ? Number(formData.episodes_watched) : 0,
//     };

//     createContent(payload)
//       .then(() => navigate("/"))
//       .catch((err) => console.error(err));
//   };

//   // --- UI COMPONENTS ---
//   const InputField = ({ label, name, type = "text", placeholder, value, onChange, required = false }) => (
//     <div className="flex flex-col gap-2">
//       <label className="text-gray-400 text-xs uppercase tracking-wider font-bold">{label}</label>
//       <input
//         name={name}
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 focus:border-red-500 focus:outline-none transition text-white placeholder-gray-600"
//       />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#0a0000] text-white px-4 md:px-20 pt-24 pb-12">
      
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-4xl font-black mb-8 text-red-600 border-b border-white/10 pb-4">
//           Add New Content
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* --- LEFT COLUMN: Search & Poster --- */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Search Section */}
//             <div className="bg-[#120505] border border-white/10 rounded-xl p-6 shadow-xl">
//               <label className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2 block">
//                 Auto-Fill from TMDB
//               </label>
              
//               <div className="flex flex-col gap-3">
//                 <select
//                   name="content_type"
//                   onChange={handleChange}
//                   value={formData.content_type}
//                   className="bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none"
//                 >
//                   <option value="movie">Movie</option>
//                   <option value="tv">TV Show</option>
//                 </select>

//                 <div className="flex gap-2">
//                   <input
//                     name="title"
//                     placeholder="Enter Title..."
//                     value={formData.title}
//                     onChange={handleChange}
//                     className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
//                   />
//                   <button 
//                     onClick={handleFetchFromTMDB}
//                     disabled={loading}
//                     className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-sm transition disabled:opacity-50"
//                   >
//                     {loading ? "..." : "🔍"}
//                   </button>
//                 </div>
//               </div>

//               {/* Search Results Dropdown */}
//               {searchResults.length > 0 && (
//                 <div className="mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
//                   {searchResults.map((item) => (
//                     <div
//                       key={item.id}
//                       onClick={() => handleSelectTMDB(item)}
//                       className="px-4 py-3 hover:bg-red-600/20 cursor-pointer border-b border-white/5 text-sm transition flex justify-between items-center group"
//                     >
//                       <span className="font-medium group-hover:text-red-400">{item.title || item.name}</span>
//                       <span className="text-gray-500 text-xs">
//                         {(item.release_date || item.first_air_date)?.slice(0, 4)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Poster Preview */}
//             <div className="bg-[#120505] border border-white/10 rounded-xl p-4 shadow-xl flex items-center justify-center min-h-[400px]">
//               {formData.poster_url ? (
//                 <img
//                   src={formData.poster_url}
//                   alt="Poster"
//                   className="rounded-lg shadow-2xl w-full h-auto object-cover border border-white/10"
//                 />
//               ) : (
//                 <div className="text-gray-600 text-center">
//                   <p className="text-4xl mb-2">🎬</p>
//                   <p className="text-sm">Poster Preview</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* --- RIGHT COLUMN: Details Form --- */}
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="bg-[#120505] border border-white/10 rounded-xl p-8 shadow-2xl space-y-6">
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <InputField 
//                   label="Title" 
//                   name="title" 
//                   value={formData.title} 
//                   onChange={handleChange} 
//                   required 
//                 />
                
//                 <InputField 
//                   label="Director" 
//                   name="director" 
//                   value={formData.director} 
//                   onChange={handleChange} 
//                 />
//               </div>

//               <InputField 
//                 label="Genre" 
//                 name="genre" 
//                 value={formData.genre} 
//                 onChange={handleChange} 
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <InputField 
//                   label="Platform" 
//                   name="platform" 
//                   placeholder="Netflix, Prime, Disney+..." 
//                   value={formData.platform} 
//                   onChange={handleChange} 
//                   required 
//                 />

//                 <div className="flex flex-col gap-2">
//                   <label className="text-gray-400 text-xs uppercase tracking-wider font-bold">Status</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 focus:border-red-500 focus:outline-none transition text-white appearance-none"
//                   >
//                     <option value="watching">👀 Watching</option>
//                     <option value="completed">✅ Completed</option>
//                     <option value="wishlist">📝 Wishlist</option>
//                   </select>
//                 </div>
//               </div>

//               {/* TV Show Specific Fields */}
//               {formData.content_type === "tv" && (
//                 <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg grid grid-cols-2 gap-6 animate-fade-in-up">
//                   <InputField 
//                     label="Total Episodes" 
//                     name="total_episodes" 
//                     type="number" 
//                     value={formData.total_episodes} 
//                     onChange={handleChange} 
//                   />
//                   <InputField 
//                     label="Episodes Watched" 
//                     name="episodes_watched" 
//                     type="number" 
//                     value={formData.episodes_watched} 
//                     onChange={handleChange} 
//                   />
//                 </div>
//               )}

//               {/* Overview / Notes */}
//               <div className="flex flex-col gap-2">
//                 <label className="text-gray-400 text-xs uppercase tracking-wider font-bold">Overview / Notes</label>
//                 <textarea
//                   name="overview"
//                   rows="4"
//                   placeholder="Brief summary or your thoughts..."
//                   value={formData.overview}
//                   onChange={handleChange}
//                   className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 focus:border-red-500 focus:outline-none transition text-white placeholder-gray-600 resize-none"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-red-600/30 transition transform hover:-translate-y-1 mt-4"
//               >
//                 Save to Library
//               </button>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContent } from "../api/contentApi";
import { searchTMDB, getTMDBDetails } from "../api/tmdbApi";

export default function AddContent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content_type: "movie",
    director: "",
    genre: "",
    platform: "",
    status: "watching",
    total_episodes: "",
    episodes_watched: 0,
    poster_url: "",
    overview: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFetchFromTMDB = async () => {
    if (!formData.title.trim()) return;

    try {
      setLoading(true);
      const res = await searchTMDB(formData.title, formData.content_type);
      setSearchResults(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTMDB = async (item) => {
    try {
      setLoading(true);
      const res = await getTMDBDetails(item.id, formData.content_type);

      setFormData((prev) => ({
        ...prev,
        title: res.data.title || prev.title,
        director: res.data.director || "",
        genre: res.data.genres || "",
        overview: res.data.overview || "",
        poster_url: res.data.poster_url || "",
        total_episodes:
          prev.content_type === "tv" ? res.data.total_episodes || "" : "",
      }));

      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      total_episodes:
        formData.content_type === "tv"
          ? Number(formData.total_episodes)
          : null,
      episodes_watched:
        formData.content_type === "tv"
          ? Number(formData.episodes_watched)
          : 0,
    };

    await createContent(payload);
    navigate("/");
  };

  /* -------------------- UI HELPERS -------------------- */

  const InputField = ({ label, name, type = "text", ...props }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase text-gray-400 font-semibold">
        {label}
      </label>
      <input
        name={name}
        type={type}
        onChange={handleChange}
        className="bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
        {...props}
      />
    </div>
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-[#0a0000] text-white px-4 md:px-16 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-10 text-red-600">
          Add New Content
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: TMDB + POSTER */}
          <div className="space-y-6">

            {/* TMDB SEARCH */}
            <div className="bg-[#120505] border border-white/10 rounded-xl p-6">
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Auto-Fill from TMDB
              </label>

              <div className="flex flex-col gap-3 mt-3">
                <select
                  name="content_type"
                  value={formData.content_type}
                  onChange={handleChange}
                  className="bg-black/60 border border-white/20 rounded-lg px-4 py-2"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>

                <div className="flex gap-2">
                  <input
                    name="title"
                    placeholder="Search title..."
                    value={formData.title}
                    onChange={handleChange}
                    className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFromTMDB}
                    disabled={loading}
                    className="bg-red-600 px-4 rounded-lg font-bold disabled:opacity-50"
                  >
                    {loading ? "..." : "🔍"}
                  </button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-3 max-h-56 overflow-y-auto border border-white/10 rounded-lg">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectTMDB(item)}
                      className="px-4 py-3 text-sm hover:bg-red-600/20 cursor-pointer flex justify-between"
                    >
                      <span>{item.title || item.name}</span>
                      <span className="text-gray-500">
                        {(item.release_date || item.first_air_date)?.slice(0, 4)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* POSTER PREVIEW */}
            <div className="bg-[#120505] border border-white/10 rounded-xl min-h-[420px] flex items-center justify-center">
              {formData.poster_url ? (
                <img
                  src={formData.poster_url}
                  alt="Poster"
                  className="rounded-lg w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-600 text-sm">Poster Preview</p>
              )}
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-[#120505] border border-white/10 rounded-xl p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Title"
                  name="title"
                  value={formData.title}
                  required
                />
                <InputField
                  label="Director"
                  name="director"
                  value={formData.director}
                />
              </div>

              <InputField
                label="Genre"
                name="genre"
                value={formData.genre}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Platform"
                  name="platform"
                  value={formData.platform}
                  required
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase text-gray-400 font-semibold">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-black/60 border border-white/20 rounded-lg px-4 py-3"
                  >
                    <option value="watching">Watching</option>
                    <option value="completed">Completed</option>
                    <option value="wishlist">Wishlist</option>
                  </select>
                </div>
              </div>

              {formData.content_type === "tv" && (
                <div className="grid grid-cols-2 gap-6">
                  <InputField
                    label="Total Episodes"
                    name="total_episodes"
                    type="number"
                    value={formData.total_episodes}
                  />
                  <InputField
                    label="Episodes Watched"
                    name="episodes_watched"
                    type="number"
                    value={formData.episodes_watched}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase text-gray-400 font-semibold">
                  Overview / Notes
                </label>
                <textarea
                  name="overview"
                  rows="4"
                  value={formData.overview}
                  onChange={handleChange}
                  className="bg-black/60 border border-white/20 rounded-lg px-4 py-3 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-lg font-bold text-lg"
              >
                Save to Library
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
