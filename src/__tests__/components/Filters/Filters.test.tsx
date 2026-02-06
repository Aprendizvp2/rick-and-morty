import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../../../components/Filters/Filters';

describe('Filters', () => {
  const mockOnClose = jest.fn();
  const mockOnApplyFilter = jest.fn();
  const mockOnClearFilters = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    filters: {},
    characterFilter: 'all' as const,
    onApplyFilter: mockOnApplyFilter,
    onClearFilters: mockOnClearFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter sections', () => {
    render(<Filters {...defaultProps} />);

    expect(screen.getByText('Character')).toBeInTheDocument();
    expect(screen.getByText('Specie')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  test('applies character filter when option is clicked', () => {
    render(<Filters {...defaultProps} />);

    const favoritesButton = screen.getByText('Favorites');
    fireEvent.click(favoritesButton);

    const applyButton = screen.getByText('Filter');
    fireEvent.click(applyButton);

    expect(mockOnApplyFilter).toHaveBeenCalledWith({}, 'starred');
  });

  test('applies species filter correctly', () => {
    render(<Filters {...defaultProps} />);

    const humanButton = screen.getByText('Human');
    fireEvent.click(humanButton);

    const applyButton = screen.getByText('Filter');
    fireEvent.click(applyButton);

    expect(mockOnApplyFilter).toHaveBeenCalledWith({ species: 'Human' }, 'all');
  });

  test('applies multiple filters correctly', () => {
    render(<Filters {...defaultProps} />);

    fireEvent.click(screen.getByText('Human'));
    fireEvent.click(screen.getByText('Alive'));
    fireEvent.click(screen.getByText('Male'));

    const applyButton = screen.getByText('Filter');
    fireEvent.click(applyButton);

    expect(mockOnApplyFilter).toHaveBeenCalledWith({
      species: 'Human',
      status: 'Alive',
      gender: 'Male',
    }, 'all');
  });

  test('clears all filters when clear button is clicked', () => {
    render(<Filters {...defaultProps} />);

    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  test('closes modal when overlay is clicked', () => {
    render(<Filters {...defaultProps} />);

    const overlay = screen.getByTestId('filter-overlay');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});