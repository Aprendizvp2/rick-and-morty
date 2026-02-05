import { useState, useEffect, useCallback } from 'react';

// Evento personalizado para sincronizar cambios entre componentes
const FAVORITES_CHANGED_EVENT = 'rickMortyFavoritesChanged';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rickMortyFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rickMortyFavorites', JSON.stringify(favorites));
    // Disparar evento personalizado para sincronizar otros componentes
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { 
      detail: favorites 
    }));
  }, [favorites]);

  // Escuchar cambios desde otros componentes
  useEffect(() => {
    const handleFavoritesChange = (event: Event) => {
      const customEvent = event as CustomEvent<string[]>;
      const newFavorites = customEvent.detail;
      // Solo actualizar si el valor es diferente para evitar bucles infinitos
      setFavorites(prev => {
        if (JSON.stringify(prev.sort()) === JSON.stringify(newFavorites.sort())) {
          return prev;
        }
        return newFavorites;
      });
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange);
    
    // También escuchar cambios en localStorage (para sincronización entre pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rickMortyFavorites' && e.newValue) {
        const newFavorites = JSON.parse(e.newValue);
        setFavorites(prev => {
          if (JSON.stringify(prev.sort()) === JSON.stringify(newFavorites.sort())) {
            return prev;
          }
          return newFavorites;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleFavoritesChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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