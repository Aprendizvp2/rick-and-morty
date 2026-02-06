import { render, screen } from '@testing-library/react';
import MainLayout from '../../../components/Layout/MainLayout';

describe('MainLayout', () => {
  test('renders children correctly', () => {
    render(
      <MainLayout>
        <div data-testid="test-child">Test Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    expect(screen.getByText(/Data provided by the Rick and Morty API/i)).toBeInTheDocument();
    expect(screen.getByText(/Character Explorer/i)).toBeInTheDocument();
  });

  test('has correct container classes', () => {
    render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('container');
    expect(mainElement).toHaveClass('mx-auto');
  });

  test('applies background color correctly', () => {
    render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    const layoutContainer = screen.getByRole('main').parentElement;
    expect(layoutContainer).toHaveClass('bg-gray-50');
  });

  test('has proper spacing and padding', () => {
    render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('px-4');
    expect(mainElement).toHaveClass('py-8');
  });
});