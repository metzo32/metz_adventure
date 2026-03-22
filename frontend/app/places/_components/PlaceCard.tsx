"use client";

import type { Place } from "@/app/places/types";

const IMAGE_BASE = "http://localhost:4000";

interface PlaceCardProps {
  place: Place;
  onClick: (place: Place) => void;
}

export const PlaceCard = ({ place, onClick }: PlaceCardProps) => {
  const handleClick = () => onClick(place);

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer aspect-3/4 hover:scale-[1.02] transition-transform duration-200"
      onClick={handleClick}
    >
      {/* 배경 이미지 or 회색 플레이스홀더 */}
      {place.imageUrl ? (
        <img
          src={`${IMAGE_BASE}${place.imageUrl}`}
          alt={place.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-400" />
      )}

      {/* Overlay layer */}
      <div className="absolute inset-0">
        {/* Tag badge - top right */}
        <div className="absolute top-3 right-3 z-20 bg-black/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {place.tag}
        </div>

        {/* Blur + gradient overlay from 25% down */}
        <div
          className={`absolute inset-x-0 bottom-0 top-0 z-10 bg-linear-to-b from-transparent via-black/20 to-black/70`}
        />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 z-20">
          <div className="flex items-end justify-between mb-1.5">
            <h3 className="text-white font-bold text-base leading-tight line-clamp-1 flex-1 mr-2">
              {place.title}
            </h3>
            <span className="text-white/90 text-sm font-semibold whitespace-nowrap">
              ★ {place.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-white/75 text-xs line-clamp-2 leading-relaxed">
            {place.memo}
          </p>
        </div>
      </div>
    </div>
  );
};
