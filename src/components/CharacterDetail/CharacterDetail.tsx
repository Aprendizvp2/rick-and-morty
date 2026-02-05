import React from "react";
import { motion } from "framer-motion";
import { X, Heart, HeartOff } from "lucide-react";
import type { Character } from "../../types/character";
import { useFavorites } from "../../hooks/useFavorites";

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
  isMobile?: boolean;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onClose,
  isMobile = false,
}) => {
  const { favorites } = useFavorites();
  const isFavorite = favorites.includes(character.id);

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      }}
      className={`bg-white ${isMobile ? "rounded-t-2xl" : "rounded-xl border border-gray-200"} overflow-hidden h-full`}
    >
      {/* Header - Compacto */}
      <div className="flex justify-end p-2">
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 hover:bg-primary-gray-100 rounded-full transition-colors sm:hidden"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
        </motion.button>
      </div>
      <div className="p-12 from-primary-50 to-white">
        {/* Contenedor de la imagen con posición relativa */}
        <motion.div 
          variants={itemVariants}
          className="relative inline-block"
        >
          <img
            src={character.image}
            alt={character.name}
            className="w-20 h-20 object-cover rounded-full shadow-lg"
          />
          
          {/* Corazón sobrepuesto en esquina inferior derecha */}
          <motion.button
            variants={itemVariants}
            disabled
            className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg border border-gray-200"
          >
            {isFavorite ? (
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-600 fill-secondary-600" />
            ) : (
              <HeartOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            )}
          </motion.button>
        </motion.div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex-1 min-w-0">
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-black truncate"
            >
              {character.name}
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Content - Responsive */}
      <div className="px-12">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Character Info */}
          <motion.div
            variants={itemVariants}
            className="w-full space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <motion.div
                className="border-b-1 border-gray-200 pb-4"
                variants={itemVariants}
              >
                <h3 className="text-base sm:text-lg font-medium text-black mb-1">
                  Species
                </h3>
                <p className="text-base sm:text-lg text-primary-gray-100 font-medium">
                  {character.species}
                </p>
              </motion.div>

              <motion.div
                className="border-b-1 border-gray-200 pb-4"
                variants={itemVariants}
              >
                <h3 className="text-base sm:text-lg font-medium text-black mb-1">
                  Status
                </h3>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium inline-block ${
                    character.status === "Alive"
                      ? "bg-green-100 text-green-800"
                      : character.status === "Dead"
                        ? "bg-red-100 text-red-800"
                        : "bg-primary-gray-100 text-white"
                  }`}
                >
                  {character.status}
                </span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-base sm:text-lg font-medium text-black mb-1">
                  Gender
                </h3>
                <p className="text-base sm:text-lg text-primary-gray-100 font-medium">
                  {character.gender}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterDetail;