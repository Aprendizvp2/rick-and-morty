import React, { useState } from "react";
import { X } from "lucide-react";
import type { FilterOptions } from "../../types/character";

type CharacterFilterType = "all" | "starred" | "others";

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  characterFilter: CharacterFilterType;
  onApplyFilter: (
    filters: FilterOptions,
    characterFilter: CharacterFilterType,
  ) => void;
  onClearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  onClose,
  filters,
  characterFilter,
  onApplyFilter,
  onClearFilters,
}) => {
  // Estado local - sincronizar con props cuando cambian
  const [localFilters, setLocalFilters] = useState(filters);
  const [localCharacterFilter, setLocalCharacterFilter] =
    useState(characterFilter);

  const handleFilterClick = (
    type: "status" | "species" | "gender",
    value: string,
  ) => {
    const newFilters = { ...localFilters };

    if (value === "All") {
      delete newFilters[type];
    } else {
      newFilters[type] = value;
    }

    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    // Aplicar filtros solo cuando se presiona Apply
    onApplyFilter(localFilters, localCharacterFilter);
  };

  const handleClear = () => {
    setLocalFilters({});
    setLocalCharacterFilter("all");
    onClearFilters();
  };

  const isActive = (type: "status" | "species" | "gender", value: string) => {
    if (value === "All") return !localFilters[type];
    return localFilters[type] === value;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay - cierra al hacer clic */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal - NO cierra al hacer clic dentro */}
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()} // 🔥 ESTO ES CLAVE
      >
        {/* Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            type="button"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Character Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Character
            </h3>
            <div className="flex flex-wrap gap-2">
              {(["all", "starred", "others"] as CharacterFilterType[]).map(
                (option) => (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocalCharacterFilter(option);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      localCharacterFilter === option
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    type="button"
                  >
                    {option === "starred"
                      ? "Favorites"
                      : option === "others"
                        ? "Others"
                        : "All"}
                    {localCharacterFilter === option && " ✓"}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Species Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Species
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Human",
                "Alien",
                "Humanoid",
                "Robot",
                "Animal",
                "Mythological",
              ].map((specie) => (
                <button
                  key={specie}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterClick("species", specie);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    isActive("species", specie)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  type="button"
                >
                  {specie}
                  {isActive("species", specie) && " ✓"}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Alive", "Dead", "unknown"].map((status) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterClick("status", status);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    isActive("status", status)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  type="button"
                >
                  {status}
                  {isActive("status", status) && " ✓"}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Female", "Male", "Genderless", "unknown"].map(
                (gender) => (
                  <button
                    key={gender}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterClick("gender", gender);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      isActive("gender", gender)
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    type="button"
                  >
                    {gender}
                    {isActive("gender", gender) && " ✓"}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApply();
              }}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              type="button"
            >
              Apply Filters
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              type="button"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
