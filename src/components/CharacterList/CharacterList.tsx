import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CHARACTERS } from "../../services/graphql/queries";
import { Search } from "lucide-react";
import type { Character, FilterOptions } from "../../types/character";
import CharacterCard from "../CharacterCard/CharacterCard";
import CharacterDetail from "../CharacterDetail/CharacterDetail";
import { useFavorites } from "../../hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";
import Filters from "../Filters/Filters";
import Loading from "../Loading/Loading";
import { FilterIcon } from "../../assets/icons";
import { SortIcon } from "../../assets/icons";

type CharactersQueryResult = {
  characters: {
    results: Character[];
    info?: {
      next?: number | null;
    };
  };
};

type CharacterFilterType = "all" | "starred" | "others";

export default function CharacterList() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});
  const [appliedCharacterFilter, setAppliedCharacterFilter] =
    useState<CharacterFilterType>("all");
  const [page, setPage] = useState(1);
  const [softDeleted, setSoftDeleted] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite } = useFavorites();

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { loading, error, data, refetch } = useQuery<CharactersQueryResult>(
    GET_CHARACTERS,
    {
      variables: { page, filter: appliedFilters },
      fetchPolicy: "cache-and-network",
    },
  );

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSoftDelete = (id: string) => {
    setSoftDeleted((prev) => [...prev, id]);
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
    }
  };

  // Función de búsqueda que SOLO busca por nombre (como solicitaste)
  const searchCharacters = (characters: Character[], searchTerm: string) => {
    if (!searchTerm.trim()) return characters;

    const term = searchTerm.toLowerCase();

    // SOLO buscar por nombre
    return characters.filter((character) =>
      character.name.toLowerCase().includes(term),
    );
  };

  // Filtrar y ordenar personajes con búsqueda
  const filteredAndSortedCharacters = useMemo(() => {
    if (!data?.characters?.results) return [];

    let characters = data.characters.results.filter(
      (char: Character) => !softDeleted.includes(char.id),
    );

    // Aplicar filtro de character type
    if (appliedCharacterFilter === "starred") {
      characters = characters.filter((char) => favorites.includes(char.id));
    } else if (appliedCharacterFilter === "others") {
      characters = characters.filter((char) => !favorites.includes(char.id));
    }

    // Aplicar búsqueda en tiempo real (SOLO por nombre)
    if (searchInput.trim()) {
      characters = searchCharacters(characters, searchInput);
    }

    // Ordenar
    characters.sort((a: Character, b: Character) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

    return characters;
  }, [
    data,
    sortOrder,
    softDeleted,
    favorites,
    appliedCharacterFilter,
    searchInput,
  ]);

  // Separar favoritos automáticamente
  const favoriteCharacters = useMemo(() => {
    return filteredAndSortedCharacters.filter((char) =>
      favorites.includes(char.id),
    );
  }, [filteredAndSortedCharacters, favorites]);

  const otherCharacters = useMemo(() => {
    return filteredAndSortedCharacters.filter(
      (char) => !favorites.includes(char.id),
    );
  }, [filteredAndSortedCharacters, favorites]);

  const handleApplyFilter = (
    filters: FilterOptions,
    characterFilter: CharacterFilterType,
  ) => {
    console.log("🔧 Aplicando filtros desde modal:", filters, characterFilter);

    // Limpiar búsqueda cuando se aplican filtros
    setSearchInput("");

    // Aplicar filtros y resetear página
    setAppliedFilters(filters);
    setAppliedCharacterFilter(characterFilter);
    setPage(1);
    setIsApplyingFilter(true);

    // Refetch con nuevos filtros
    refetch({ page: 1, filter: filters }).then(() => {
      setTimeout(() => setIsApplyingFilter(false), 300);
    });
  };

  const clearFilters = () => {
    console.log("🧹 Limpiando todos los filtros");
    setAppliedFilters({});
    setAppliedCharacterFilter("all");
    setSearchInput("");
    setShowFiltersDropdown(false);
    setPage(1);
    setIsApplyingFilter(true);

    // Refetch sin filtros
    refetch({ page: 1, filter: {} }).then(() => {
      setTimeout(() => setIsApplyingFilter(false), 300);
    });
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (error)
    return (
      <div className="text-center py-12 px-4">
        <p className="text-red-600">
          Error loading characters: {error.message}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-2 sm:px-0">
            Rick and Morty list
          </h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-4 sm:mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />

              {/* Filter Button dentro del input */}
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                ref={filtersRef} // ESTO QUEDA ASÍ
              >
                <button
                  onClick={() => {
                    setShowFiltersDropdown(!showFiltersDropdown);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-md transition-all z-50 text-sm sm:text-base ${
                    showFiltersDropdown ||
                    Object.keys(appliedFilters).length > 0
                  }`}
                >
                  <FilterIcon className="text-primary-700" />
                </button>
              </div>
            </div>

            {/* Sort Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSort}
              className="w-full flex flex-row items-center justify-center gap-2 sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap shadow-sm text-sm sm:text-base"
            >
              <SortIcon className="text-white" />
              Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </motion.button>
          </div>

          {/* Mostrar filtros activos */}
          {(appliedFilters.status ||
            appliedFilters.species ||
            appliedFilters.gender ||
            appliedCharacterFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4 px-2 sm:px-0">
              {appliedCharacterFilter !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {appliedCharacterFilter === "starred"
                    ? "Favorites"
                    : "Others"}
                  <button
                    onClick={() => {
                      setAppliedCharacterFilter("all");
                      setPage(1);
                      refetch({ page: 1, filter: appliedFilters });
                    }}
                    className="ml-1.5 hover:bg-primary-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {appliedFilters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {appliedFilters.status}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters };
                      delete newFilters.status;
                      setAppliedFilters(newFilters);
                      setPage(1);
                      refetch({ page: 1, filter: newFilters });
                    }}
                    className="ml-1.5 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {appliedFilters.species && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Species: {appliedFilters.species}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters };
                      delete newFilters.species;
                      setAppliedFilters(newFilters);
                      setPage(1);
                      refetch({ page: 1, filter: newFilters });
                    }}
                    className="ml-1.5 hover:bg-green-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {appliedFilters.gender && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Gender: {appliedFilters.gender}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters };
                      delete newFilters.gender;
                      setAppliedFilters(newFilters);
                      setPage(1);
                      refetch({ page: 1, filter: newFilters });
                    }}
                    className="ml-1.5 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Loading Indicator */}
        {(loading && page === 1) || isApplyingFilter ? (
          <div className="mb-6">
            <Loading />
          </div>
        ) : null}

        {/* Filters Dropdown - Mejorado para responsive */}
        {showFiltersDropdown && (
          <Filters
            isOpen={showFiltersDropdown}
            onClose={() => {
              setShowFiltersDropdown(false);
            }}
            filters={appliedFilters}
            characterFilter={appliedCharacterFilter}
            onApplyFilter={(filters, characterFilter) => {
              handleApplyFilter(filters, characterFilter);
              setShowFiltersDropdown(false);
            }}
            onClearFilters={() => {
              clearFilters();
            }}
          />
        )}

        {/* Main Layout */}
        <div
          className={`flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 ${showFiltersDropdown ? "lg:mt-0 mt-4" : ""}`}
        >
          {/* Left Side - Character List */}
          <div
            className={`w-full ${selectedCharacter && !isMobile ? "lg:w-1/2" : ""}`}
          >
            {/* Favorites Section */}
            <AnimatePresence mode="wait">
              {favoriteCharacters.length > 0 &&
                appliedCharacterFilter !== "others" && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mb-6 sm:mb-8 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-3 sm:mb-4 px-2 sm:px-0">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                        STARRED CHARACTERS ({favoriteCharacters.length})
                      </h2>
                    </div>
                    <div className="">
                      <AnimatePresence>
                        {favoriteCharacters.map((character: Character) => (
                          <motion.div
                            key={character.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            layout="position"
                          >
                            <CharacterCard
                              id={`character-${character.id}`}
                              character={character}
                              onSoftDelete={() =>
                                handleSoftDelete(character.id)
                              }
                              onToggleFavorite={() =>
                                toggleFavorite(character.id)
                              }
                              onClick={() => setSelectedCharacter(character)}
                              isSelected={
                                selectedCharacter?.id === character.id
                              }
                              isFavorite={true}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* All Characters Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-0">
                {appliedCharacterFilter === "others"
                  ? "OTHER CHARACTERS"
                  : "CHARACTERS"}
                (
                {appliedCharacterFilter === "others"
                  ? otherCharacters.length
                  : otherCharacters.length}
                )
              </h2>

              <AnimatePresence mode="popLayout">
                {otherCharacters.length > 0 ? (
                  <div className="">
                    {otherCharacters.map(
                      (character: Character, index: number) => (
                        <motion.div
                          key={character.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            delay: index * 0.03,
                          }}
                          layout="position"
                        >
                          <CharacterCard
                            id={`character-${character.id}`}
                            character={character}
                            onSoftDelete={() => handleSoftDelete(character.id)}
                            onToggleFavorite={() =>
                              toggleFavorite(character.id)
                            }
                            onClick={() => setSelectedCharacter(character)}
                            isSelected={selectedCharacter?.id === character.id}
                            isFavorite={false}
                          />
                        </motion.div>
                      ),
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-200 mx-2 sm:mx-0"
                  >
                    <p className="text-gray-500 text-sm sm:text-base">
                      {searchInput.trim()
                        ? `No characters found for "${searchInput}"`
                        : "No characters found"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Load More Button */}
            {data?.characters?.info?.next && !searchInput.trim() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex justify-center mt-6 sm:mt-8 px-2 sm:px-0"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-md text-sm sm:text-base"
                >
                  {loading ? "Loading..." : "Load More"}
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Right Side - Character Detail */}
          <AnimatePresence>
            {selectedCharacter && !isMobile && (
              <motion.div
                key="detail-desktop"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:w-1/2"
              >
                <div className="sticky top-4 sm:top-6 md:top-8">
                  <CharacterDetail
                    character={selectedCharacter}
                    onClose={() => setSelectedCharacter(null)}
                    isMobile={false}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character Detail Modal para Mobile */}
      <AnimatePresence>
        {selectedCharacter && isMobile && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCharacter(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeOut",
              }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
            >
              <CharacterDetail
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
