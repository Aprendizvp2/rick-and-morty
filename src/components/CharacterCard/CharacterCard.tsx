import React, { useState, useEffect } from "react";
import { Heart, Trash2, MessageSquare } from "lucide-react";
import type { Character } from "../../types/character";
import { useComments } from "../../hooks/useComments";
import { motion, AnimatePresence } from "framer-motion";

interface CharacterCardProps {
  character: Character;
  onSoftDelete: () => void;
  onToggleFavorite: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  isFavorite?: boolean;
  id?: string;
}

export default function CharacterCard({
  character,
  onSoftDelete,
  onToggleFavorite,
  onClick,
  isSelected = false,
  isFavorite = false,
  id,
}: CharacterCardProps) {
  const { getComments, addComment } = useComments();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isFav, setIsFav] = useState(isFavorite);

  // Sincronizar isFav con el prop isFavorite cuando cambie
  useEffect(() => {
    setIsFav(isFavorite);
  }, [isFavorite]);

  const comments = getComments(character.id);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newComment.trim()) {
      addComment(character.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    onToggleFavorite();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSoftDelete();
  };

  return (
    <motion.div
      id={id}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all duration-200 cursor-pointer 
        border-b-2 border-gray-200 hover:border-primary-100
        ${isSelected ? "bg-primary-100 border-primary-300" : "hover:bg-gray-50 rounded-none"}
        mx-1 sm:mx-0
      `}
    >
      {/* Character Image */}
      <div className="relative flex-shrink-0">
        <img
          src={character.image}
          alt={character.name}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover shadow"
        />
      </div>

      {/* Character Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-row justify-between items-center gap-2">
          <div>
            <div className="mb-1 sm:mb-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {character.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {character.species}
              </p>
              {/* Status Badge */}
              <motion.span
                className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 w-fit sm:w-auto ${
                  character.status === "Alive"
                    ? "bg-green-100 text-green-800"
                    : character.status === "Dead"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {character.status}
              </motion.span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 pt-2 sm:pt-3">
              {/* Comments Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
              >
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{comments.length}</span>
              </motion.button>

              {/* Soft Delete Button */}
              <motion.button
                onClick={handleDeleteClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Remove</span>
                <span className="xs:hidden">Del</span>
              </motion.button>
            </div>
          </div>
          {/* Favorite Heart */}
          <motion.button
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className=" bg-white p-2 rounded-full shadow-sm cursor-pointer"
            animate={{ scale: isFav ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {isFav ? (
              <Heart className="h-3 w-3 sm:h-6 sm:w-6 text-secondary-600 fill-secondary-600" />
            ) : (
              <Heart className="h-3 w-3 sm:h-6 sm:w-6 bg-transparent text-gray-400 hover:text-secondary-600" />
            )}
          </motion.button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                {comments.length > 0 ? (
                  <div className="space-y-2 mb-2 sm:mb-3 max-h-32 overflow-y-auto">
                    {comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="bg-gray-50 p-2 rounded text-xs sm:text-sm"
                      >
                        <p className="text-gray-800">{comment.text}</p>
                        <p className="text-gray-400 mt-1 text-xs">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs sm:text-sm text-gray-500 text-center mb-2 sm:mb-3"
                  >
                    No comments yet
                  </motion.p>
                )}

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-600 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <motion.button
                    type="submit"
                    disabled={!newComment.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 sm:px-3 py-1.5 bg-primary-600 text-white text-xs sm:text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    Add
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
