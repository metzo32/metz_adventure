"use client";

import { Button } from "@/components/Button";
import { FILTER_TAGS } from "@/app/places/data/constants";

interface FilterChipProps {
  tag: string;
  isActive: boolean;
  onFilter: (tag: string) => void;
}

const FilterChip = ({ tag, isActive, onFilter }: FilterChipProps) => {
  const handleClick = () => onFilter(tag);
  return (
    <Button mode="filter" onClick={handleClick} isActive={isActive}>
      {tag}
    </Button>
  );
};

interface PlaceFilterPanelProps {
  activeTag: string;
  onFilter: (tag: string) => void;
}

export const PlaceFilterPanel = ({ activeTag, onFilter }: PlaceFilterPanelProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTER_TAGS.map((tag) => (
        <FilterChip key={tag} tag={tag} isActive={activeTag === tag} onFilter={onFilter} />
      ))}
    </div>
  );
};
