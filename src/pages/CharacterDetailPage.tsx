import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_CHARACTER_DETAILS } from '../services/graphql/queries';
import { ArrowLeft, Home } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useComments } from '../hooks/useComments';

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  interface Character {
    id: string;
    name: string;
    image: string;
    species: string;
    status: string;
    gender: string;
    origin: { name: string };
    location: { name: string };
  }

  interface CharacterDetailsData {
    character: Character;
  }

  const { data, loading, error } = useQuery<CharacterDetailsData>(GET_CHARACTER_DETAILS, {
    variables: { id },
  });
  const { favorites, toggleFavorite } = useFavorites();
  const { getComments, addComment } = useComments();
  const [newComment, setNewComment] = useState('');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const character = data?.character;
  if (!character) return <div>Character not found</div>;

  const isFavorite = favorites.includes(character.id);
  const comments = getComments(character.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft /> Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Home /> Home
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>
                <button
                  onClick={() => toggleFavorite(character.id)}
                  className="p-2 hover:bg-yellow-50 rounded-full"
                >
                  {isFavorite ? '★ Favorite' : '☆ Add to Favorites'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Species</h3>
                    <p className="text-gray-900">{character.species}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      character.status === 'Alive' ? 'bg-green-100 text-green-800' :
                      character.status === 'Dead' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {character.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Gender</h3>
                    <p className="text-gray-900">{character.gender}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Origin</h3>
                    <p className="text-gray-900">{character.origin.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p className="text-gray-900">{character.location.name}</p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                <div className="space-y-4 mb-6">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment about this character..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                  <button
                    onClick={() => {
                      if (newComment.trim()) {
                        addComment(character.id, newComment.trim());
                        setNewComment('');
                      }
                    }}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailPage;