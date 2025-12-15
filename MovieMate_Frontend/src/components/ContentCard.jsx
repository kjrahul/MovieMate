import { Link } from "react-router-dom";

// We can keep this fallback, but our Recommendation page now handles full URLs too.
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function ContentCard({ content }) {
  // Logic: Use the pre-built URL or build it from path
  const posterUrl =
    content.poster_url ||
    (content.poster_path ? `${TMDB_IMAGE_BASE}${content.poster_path}` : "/placeholder.png");

  return (
    <div className="w-48 flex-shrink-0 flex flex-col group relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:scale-105 transition duration-300 shadow-lg cursor-pointer">
      
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full">
        <img
          src={posterUrl}
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content Info */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-white font-bold text-sm truncate" title={content.title}>
          {content.title}
        </h3>

        {/* Optional: Release Year (if available) */}
        {(content.release_date || content.first_air_date) && (
            <p className="text-gray-400 text-xs mt-1">
                {(content.release_date || content.first_air_date).split("-")[0]}
            </p>
        )}

        {/* --- DB Specific Fields (Only show if they exist) --- */}
        <div className="mt-auto pt-2 space-y-1">
            {content.platform && (
            <span className="block text-[10px] text-gray-300 bg-gray-700 px-2 py-0.5 rounded w-fit">
                {content.platform}
            </span>
            )}

            {content.status && (
             <p className={`text-[10px] uppercase font-bold ${
                 content.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
             }`}>
                {content.status}
             </p>
            )}

            {/* Progress Bar for TV */}
            {content.content_type === "tv" && content.total_episodes > 0 && (
            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                <div 
                    className="bg-red-600 h-1.5 rounded-full" 
                    style={{ width: `${(content.episodes_watched / content.total_episodes) * 100}%` }}
                />
            </div>
            )}
        </div>
      </div>

      {/* Link Overlay (Make whole card clickable if ID exists) */}
      {content.id && content.status && (
        <Link to={`/content/${content.id}`} className="absolute inset-0 z-10" />
      )}
    </div>
  );
}