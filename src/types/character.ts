export interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: {
    name: string;
    url?: string;
  };
  location: {
    name: string;
    url?: string;
  };
  image: string;
  episode?: Array<{
    id: string;
    name: string;
    episode: string;
  }>;
  url?: string;
  created?: string;
}

export interface CharactersResponse {
  characters: {
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Character[];
  };
}

export interface FilterOptions {
  status?: string;
  species?: string;
  gender?: string;
  name?: string;
}