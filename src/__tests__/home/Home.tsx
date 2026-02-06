import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home/Home';

// Mock del componente CharacterList para aislar las pruebas
jest.mock('../../components/CharacterList/CharacterList', () => {
  return function MockCharacterList() {
    return (
      <div data-testid="mock-character-list">
        Mock Character List Component
      </div>
    );
  };
});

describe('Home Component', () => {
  test('renders without crashing', () => {
    render(<Home />);
    
    // Verifica que el componente se renderice sin errores
    expect(screen.getByTestId('mock-character-list')).toBeInTheDocument();
  });

  test('renders CharacterList component', () => {
    render(<Home />);
    
    // Verifica que CharacterList esté presente
    const characterList = screen.getByTestId('mock-character-list');
    expect(characterList).toBeInTheDocument();
    expect(characterList).toHaveTextContent('Mock Character List Component');
  });

  test('has correct structure', () => {
    const { container } = render(<Home />);
    
    // Verifica que haya un div contenedor
    const mainDiv = container.firstChild;
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv?.nodeName).toBe('DIV');
  });
});