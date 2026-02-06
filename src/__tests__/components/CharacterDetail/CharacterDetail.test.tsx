import { render, screen, fireEvent } from '@testing-library/react';
import type { Character } from '../../../types/character';
import CharacterDetail from '../../../components/CharacterDetail/CharacterDetail';

// Mock de los hooks
jest.mock('../../../hooks/useFavorites', () => ({
    useFavorites: () => ({
        favorites: ['1'],
    }),
}));

const mockCharacter: Character = {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: 'Scientist',
    gender: 'Male',
    origin: { name: 'Earth (C-137)' },
    location: { name: 'Citadel of Ricks' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
};

describe('CharacterDetail', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders character details correctly', () => {
        render(
            <CharacterDetail
                character={mockCharacter}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
        expect(screen.getByText('Human')).toBeInTheDocument();
        expect(screen.getByText('Alive')).toBeInTheDocument();
        expect(screen.getByText('Male')).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked (mobile)', () => {
        render(
            <CharacterDetail
                character={mockCharacter}
                onClose={mockOnClose}
                isMobile={true}
            />
        );

        const closeButton = screen.getByTestId('close-button');

        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('shows favorite heart when character is favorited', () => {
        render(
            <CharacterDetail
                character={mockCharacter}
                onClose={mockOnClose}
            />
        );

        // Busca el botón del corazón (el segundo botón en el DOM)
        const buttons = screen.getAllByRole('button');
        const favoriteButton = buttons[1]; // El segundo botón es el del corazón

        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton).toBeDisabled(); // Está disabled según tu código
    });

    test('displays correct status badge color for Alive status', () => {
        render(
            <CharacterDetail
                character={mockCharacter}
                onClose={mockOnClose}
            />
        );

        const statusBadge = screen.getByText('Alive');
        expect(statusBadge).toHaveClass('bg-green-100');
        expect(statusBadge).toHaveClass('text-green-800');
    });

    test('displays correct status badge color for Dead status', () => {
        const deadCharacter = { ...mockCharacter, status: 'Dead' as const };

        render(
            <CharacterDetail
                character={deadCharacter}
                onClose={mockOnClose}
            />
        );

        const statusBadge = screen.getByText('Dead');
        expect(statusBadge).toHaveClass('bg-red-100');
        expect(statusBadge).toHaveClass('text-red-800');
    });
});