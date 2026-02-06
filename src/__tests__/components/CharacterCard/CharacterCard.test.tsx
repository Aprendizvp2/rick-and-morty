import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { Character } from '../../../types/character';
import CharacterCard from '../../../components/CharacterCard/CharacterCard';
// Mock de los hooks

jest.mock('../../../hooks/useComments', () => ({
  useComments: () => ({
    getComments: () => [],
    addComment: () => {},
  }),
}));

// Mock de framer-motion
jest.mock('framer-motion', () => {
  const filterMotionProps = (props: any) => {
    const { whileHover, whileTap, initial, animate, exit, transition, variants, ...rest } = props;
    return rest;
  };

  return {
    motion: {
      div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
      span: ({ children, ...props }: any) => <span {...filterMotionProps(props)}>{children}</span>,
      p: ({ children, ...props }: any) => <p {...filterMotionProps(props)}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
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

describe('CharacterCard', () => {
  const mockOnSoftDelete = jest.fn();
  const mockOnToggleFavorite = jest.fn();
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders character information correctly', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onSoftDelete={mockOnSoftDelete}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  test('calls onSoftDelete when delete button is clicked', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onSoftDelete={mockOnSoftDelete}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const deleteButton = screen.getByText('Remove');
    fireEvent.click(deleteButton);
    expect(mockOnSoftDelete).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleFavorite when favorite button is clicked', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onSoftDelete={mockOnSoftDelete}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    // El botón de favoritos es el último botón (después del botón de comentarios y delete)
    const buttons = screen.getAllByRole('button');
    const favoriteButton = buttons[buttons.length - 1]; // El último botón es el del corazón
    fireEvent.click(favoriteButton);
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  test('shows comments section when comments button is clicked', async () => {
    render(
      <CharacterCard
        character={mockCharacter}
        onSoftDelete={mockOnSoftDelete}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // El botón de comentarios es el primero que contiene el número 0
    const commentsButton = screen.getByText('0').closest('button');
    expect(commentsButton).toBeInTheDocument();
    fireEvent.click(commentsButton!);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    });
  });

  test('calls onClick when card is clicked', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        onSoftDelete={mockOnSoftDelete}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />
    );

    // El card es un div con onClick, no un button, así que buscamos el div que contiene el nombre
    const card = container.querySelector('div[class*="cursor-pointer"]');
    expect(card).toBeInTheDocument();
    fireEvent.click(card!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});