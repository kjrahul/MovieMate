
// import { useState, useEffect } from "react";
// import api from "../api/axios";
// import ContentCard from "../components/ContentCard";

// const GENRES = [
//   "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance",
//   "Thriller", "Adventure", "Fantasy", "Animation", "Crime", "Mystery"
// ];

// const LANGUAGES = [
//   { code: "en", label: "English" },
//   { code: "hi", label: "Hindi" },
//   { code: "ko", label: "Korean" },
//   { code: "es", label: "Spanish" },
//   { code: "ja", label: "Japanese" },
//   { code: "ml", label: "Malayalam" },
//   { code: "ta", label: "Tamil" },
// ];

// function SkeletonGrid() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//       {[...Array(10)].map((_, i) => (
//         <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-xl" />
//       ))}
//     </div>
//   );
// }

// export default function Recommendations() {
//   const [contentType, setContentType] = useState("movie");
//   const [genre, setGenre] = useState("");
//   const [language, setLanguage] = useState("en");
//   const [prompt, setPrompt] = useState("");

//   const [results, setResults] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ----------------------------
//   // FETCH FUNCTION
//   // ----------------------------
//   const fetchRecommendations = async ({ reset = false, overrides = {} } = {}) => {
//     setLoading(true);
//     setError("");

//     try {
//       const payload = {
//         content_type: overrides.contentType ?? contentType,
//         genre: overrides.genre ?? genre,
//         language: overrides.language ?? language,
//         prompt: overrides.prompt ?? prompt,
//         page: reset ? 1 : page + 1
//       };

//       const res = await api.post("/recommendations", payload);
//       const data = res.data || [];

//       const formatted = data.map((item) => ({
//         ...item,
//         id: item.id,
//         title: item.title || item.name,
//         poster_url: item.poster_path
//           ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
//           : null,
//         release_date: item.release_date || item.first_air_date,
//         content_type: payload.content_type
//       }));

//       if (reset) {
//         setResults(formatted);
//         setPage(1);
//       } else {
//         setResults((prev) => {
//           const ids = new Set(prev.map(p => p.id));
//           return [...prev, ...formatted.filter(f => !ids.has(f.id))];
//         });
//         setPage(payload.page);
//       }

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load recommendations.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------------------
//   // HANDLERS
//   // ----------------------------
//   const changeType = (type) => {
//     setContentType(type);
//     fetchRecommendations({ reset: true, overrides: { contentType: type } });
//   };

//   const selectGenre = (g) => {
//     setGenre(g);
//     setPrompt("");
//     fetchRecommendations({ reset: true, overrides: { genre: g, prompt: "" } });
//   };

//   const selectLanguage = (lang) => {
//     setLanguage(lang);
//     fetchRecommendations({ reset: true, overrides: { language: lang } });
//   };

//   const searchByPrompt = () => {
//     setGenre("");
//     fetchRecommendations({
//       reset: true,
//       overrides: { genre: "", prompt }
//     });
//   };

//   // ----------------------------
//   // INITIAL LOAD
//   // ----------------------------
//   useEffect(() => {
//     fetchRecommendations({ reset: true });
//     // eslint-disable-next-line
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0a0000] text-white px-[5%] pt-32 pb-20">
//       <div className="max-w-7xl mx-auto space-y-12">

//         <div>
//           <h1 className="text-4xl font-black text-red-600">Explore</h1>
//           <p className="text-gray-400">Trending & personalized recommendations</p>
//         </div>

//         {/* FILTERS */}
//         <div className="bg-[#120505] border border-white/10 rounded-2xl p-6 space-y-6">
//           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
//             Browse by Category
//           </h3>

//           <div className="flex gap-2">
//             {["movie", "tv"].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => changeType(t)}
//                 className={`px-6 py-2 rounded-md font-bold ${
//                   contentType === t
//                     ? "bg-red-600"
//                     : "bg-black/40 text-gray-400"
//                 }`}
//               >
//                 {t === "movie" ? "Movies" : "TV"}
//               </button>
//             ))}
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => selectGenre("")}
//               className={`px-4 py-2 rounded-lg ${
//                 genre === "" ? "border-red-500 text-red-400" : "border-white/10"
//               } border`}
//             >
//               All
//             </button>
//             {GENRES.map((g) => (
//               <button
//                 key={g}
//                 onClick={() => selectGenre(g)}
//                 className={`px-4 py-2 rounded-lg border ${
//                   genre === g ? "border-red-500 text-red-400" : "border-white/10"
//                 }`}
//               >
//                 {g}
//               </button>
//             ))}
//           </div>

//           <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
//             {LANGUAGES.map((l) => (
//               <button
//                 key={l.code}
//                 onClick={() => selectLanguage(l.code)}
//                 className={`px-3 py-1 text-xs border rounded ${
//                   language === l.code
//                     ? "border-red-500 text-red-400"
//                     : "border-white/10 text-gray-400"
//                 }`}
//               >
//                 {l.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* PROMPT SEARCH */}
//         <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
//           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
//             Search by Prompt
//           </h3>
//           <div className="flex gap-4">
//             <input
//               type="text"
//               placeholder="e.g. comedy malayalam, korean romance"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && searchByPrompt()}
//               className="flex-1 bg-black border border-white/20 rounded-xl px-6 py-4"
//             />
//             <button
//               onClick={searchByPrompt}
//               className="px-8 bg-red-600 rounded-xl font-bold"
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         {/* RESULTS */}
//         {error && <div className="text-red-400">{error}</div>}

//         {loading && results.length === 0 ? (
//           <SkeletonGrid />
//         ) : results.length > 0 ? (
//           <>
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {results.map((item) => (
//                 <ContentCard key={item.id} content={item} />
//               ))}
//             </div>

//             <div className="flex justify-center mt-12">
//               <button
//                 onClick={() => fetchRecommendations()}
//                 disabled={loading}
//                 className="px-8 py-3 bg-white/10 rounded-full font-bold"
//               >
//                 {loading ? "Loading..." : "Load Next Page"}
//               </button>
//             </div>
//           </>
//         ) : (
//           !loading && <div className="text-center opacity-50">No results found</div>
//         )}

//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import api from "../api/axios";
import ContentCard from "../components/ContentCard";

/* TMDB GENRE ID → NAME */
const GENRE_ID_MAP = {
  28: "Action",
  35: "Comedy",
  18: "Drama",
  878: "Sci-Fi",
  27: "Horror",
  10749: "Romance",
  53: "Thriller",
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  80: "Crime",
  9648: "Mystery",
};

const GENRES = Object.values(GENRE_ID_MAP);

const LANGUAGES = [
  { code: "all", label: "All" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ko", label: "Korean" },
  { code: "es", label: "Spanish" },
  { code: "ja", label: "Japanese" },
  { code: "ml", label: "Malayalam" },
  { code: "ta", label: "Tamil" },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}

export default function Recommendations() {
  const [contentType, setContentType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("all");
  const [prompt, setPrompt] = useState("");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------
  // FETCH
  // ----------------------------
  const fetchRecommendations = async ({ reset = false, overrides = {} } = {}) => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        content_type: overrides.contentType ?? contentType,
        genre: overrides.genre ?? genre,
        language: overrides.language ?? language,
        prompt: overrides.prompt ?? prompt,
        page: reset ? 1 : page + 1,
      };

      const res = await api.post("/recommendations", payload);
      const data = res.data || [];

      const formatted = data.map((item) => ({
        id: item.id,
        title: item.title || item.name,
        poster_url: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
        release_date: item.release_date || item.first_air_date,
        content_type: payload.content_type,
        genres: item.genre_ids
          ? item.genre_ids
              .map((id) => GENRE_ID_MAP[id])
              .filter(Boolean)
              .join(", ")
          : "",
      }));

      if (reset) {
        setResults(formatted);
        setPage(1);
      } else {
        setResults((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...formatted.filter((f) => !ids.has(f.id))];
        });
        setPage(payload.page);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const changeType = (type) => {
    setContentType(type);
    fetchRecommendations({ reset: true, overrides: { contentType: type } });
  };

  const selectGenre = (g) => {
    setGenre(g);
    setPrompt("");
    fetchRecommendations({ reset: true, overrides: { genre: g, language: language, prompt: "" } });
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    fetchRecommendations({ reset: true, overrides: {genre: genre,  language: lang } });
  };

  const searchByPrompt = () => {
    setGenre("");
    fetchRecommendations({ reset: true, overrides: { genre: "", prompt } });
  };

  // ----------------------------
  // INITIAL LOAD → MIXED LANGUAGE
  // ----------------------------
  useEffect(() => {
    fetchRecommendations({
      reset: true,
      overrides: { language: "all", genre: "", prompt: "" },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0000] text-white px-[5%] pt-32 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">

        <div>
          <h1 className="text-4xl font-black text-red-600">Explore</h1>
          <p className="text-gray-400">Personalized recommendations</p>
        </div>

        {/* FILTERS */}
        <div className="bg-[#120505] border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Browse by Category
          </h3>

          <div className="flex gap-2">
            {["movie", "tv"].map((t) => (
              <button
                key={t}
                onClick={() => changeType(t)}
                className={`px-6 py-2 rounded-md font-bold ${
                  contentType === t
                    ? "bg-red-600"
                    : "bg-black/40 text-gray-400"
                }`}
              >
                {t === "movie" ? "Movies" : "TV"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => selectGenre("")}
              className={`px-4 py-2 rounded-lg border ${
                genre === "" ? "border-red-500 text-red-400" : "border-white/10"
              }`}
            >
              All
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => selectGenre(g)}
                className={`px-4 py-2 rounded-lg border ${
                  genre === g
                    ? "border-red-500 text-red-400"
                    : "border-white/10"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => selectLanguage(l.code)}
                className={`px-3 py-1 text-xs border rounded ${
                  language === l.code
                    ? "border-red-500 text-red-400"
                    : "border-white/10 text-gray-400"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROMPT SEARCH */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="e.g. comedy malayalam, korean romance"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchByPrompt()}
              className="flex-1 bg-black border border-white/20 rounded-xl px-6 py-4"
            />
            <button
              onClick={searchByPrompt}
              className="px-8 bg-red-600 rounded-xl font-bold"
            >
              Search
            </button>
          </div>
        </div>

        {loading && results.length === 0 ? (
          <SkeletonGrid />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          !loading && <div className="text-center opacity-50">No results</div>
        )}
      </div>
    </div>
  );
}
