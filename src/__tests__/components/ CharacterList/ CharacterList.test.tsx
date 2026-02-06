import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { Character } from '../../../types/character';
import CharacterList from '../../../components/CharacterList/CharacterList';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloLink, Observable } from '@apollo/client';

// Mock de los hooks
jest.mock('../../../hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useComments', () => ({
  useComments: () => ({
    getComments: () => [],
    addComment: jest.fn(),
  }),
}));

// Mock de framer-motion
jest.mock('framer-motion', () => {
  const filterMotionProps = (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { whileHover, whileTap, initial, animate, exit, transition, variants, ...rest } = props;
    return rest;
  };

  return {
    motion: {
      div: ({ children, ...props }: React.ComponentProps<'div'>) => (
        <div {...filterMotionProps(props)}>{children}</div>
      ),
      button: ({ children, ...props }: React.ComponentProps<'button'>) => (
        <button {...filterMotionProps(props)}>{children}</button>
      ),
      span: ({ children, ...props }: React.ComponentProps<'span'>) => (
        <span {...filterMotionProps(props)}>{children}</span>
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth' },
  location: { name: 'Citadel of Ricks' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

const mockData = {
  characters: {
    results: [mockCharacter],
    info: {
      next: 2,
      prev: null,
      pages: 5,
      count: 100,
    },
  },
};

// Crear un link mock que devuelva los datos
const createMockLink = (data: typeof mockData) => {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          data,
        });
        observer.complete();
      }, 100);
    });
  });
};

// Crear cliente Apollo mock
const createMockClient = () => {
  return new ApolloClient({
    link: createMockLink(mockData),
    cache: new InMemoryCache(),
  });
};

describe('CharacterList', () => {
  const mockClient = createMockClient();

  test('renders loading state initially', () => {
    render(
      <ApolloProvider client={mockClient}>
        <CharacterList />
      </ApolloProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders character list after loading', async () => {
    render(
      <ApolloProvider client={mockClient}>
        <CharacterList />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
  });

  test('sorts characters when sort button is clicked', async () => {
    render(
      <ApolloProvider client={mockClient}>
        <CharacterList />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const sortButton = screen.getByText(/Sort A-Z/i);
    fireEvent.click(sortButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Sort Z-A/i)).toBeInTheDocument();
    });
  });

  test('shows search input', async () => {
    render(
      <ApolloProvider client={mockClient}>
        <CharacterList />
      </ApolloProvider>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search by name...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  test('filters characters when search input is used', async () => {
    render(
      <ApolloProvider client={mockClient}>
        <CharacterList />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(searchInput, { target: { value: 'Rick' } });
    
    expect(searchInput).toHaveValue('Rick');
  });
});