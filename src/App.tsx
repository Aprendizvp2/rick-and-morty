import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './services/graphql/client';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </MainLayout>
      </Router>
    </ApolloProvider>
  );
}
