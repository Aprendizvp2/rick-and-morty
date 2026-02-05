import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './services/graphql/client';
import CharacterDetailPage from './pages/CharacterDetailPage';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/character/:id" element={<CharacterDetailPage />} />
            {/* Puedes agregar más rutas aquí */}
          </Routes>
        </MainLayout>
      </Router>
    </ApolloProvider>
  );
}

export default App;