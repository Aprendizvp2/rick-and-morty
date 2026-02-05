import { useState, useEffect, useCallback } from 'react';

export interface Comment {
  id: string;
  text: string;
  timestamp: Date;
}

interface CommentsMap {
  [characterId: string]: Comment[];
}

export const useComments = () => {
  const [comments, setComments] = useState<CommentsMap>(() => {
    const saved = localStorage.getItem('rickMortyComments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convertir timestamps de string a Date
        Object.keys(parsed).forEach(key => {
          parsed[key] = parsed[key].map((comment: Comment) => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }));
        });
        return parsed;
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('rickMortyComments', JSON.stringify(comments));
  }, [comments]);

  const addComment = useCallback((characterId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      timestamp: new Date()
    };

    setComments(prev => ({
      ...prev,
      [characterId]: [...(prev[characterId] || []), newComment]
    }));
  }, []);

  const getComments = useCallback((characterId: string): Comment[] => {
    return comments[characterId] || [];
  }, [comments]);

  const deleteComment = useCallback((characterId: string, commentId: string) => {
    setComments(prev => ({
      ...prev,
      [characterId]: (prev[characterId] || []).filter(comment => comment.id !== commentId)
    }));
  }, []);

  return { 
    comments, 
    addComment, 
    getComments, 
    deleteComment 
  };
};