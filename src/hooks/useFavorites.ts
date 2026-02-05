import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rickMortyFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rickMortyFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.includes(id);
      if (isAlreadyFavorite) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return { 
    favorites, 
    toggleFavorite
  };
};