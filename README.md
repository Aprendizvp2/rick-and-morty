# 🚀 Rick and Morty Character Explorer

<div align="center">
  
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite&logoColor=white)
![Testing](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)

A modern, feature-rich frontend application for exploring Rick and Morty characters with advanced filtering, sorting, and interactive features.

</div>

## 📋 Project Overview

This project is a comprehensive frontend application developed as a technical assessment. It demonstrates proficiency in modern frontend technologies and best practices while meeting all specified requirements.

## ✨ Features

### 🎯 **Core Requirements Implemented**
- ✅ **Character Listing**: Display characters in responsive cards with name, image, and species
- ✅ **Responsive Design**: Fully responsive using CSS Grid and Flexbox with Tailwind CSS
- ✅ **Sorting**: Sort characters by name (A-Z / Z-A) with visual indicators
- ✅ **Character Details**: Detailed view for each character using React Router DOM
- ✅ **Favorites System**: Mark/unmark characters as favorites with persistent storage
- ✅ **Comments Functionality**: Add, view, and persist comments for each character
- ✅ **Visual Design**: Clean UI following provided mockups with Tailwind CSS

### ⭐ **Bonus Features Implemented**
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Soft Delete**: Temporarily remove characters without permanent deletion
- ✅ **Advanced Filtering**: Filter by Status, Species, and Gender
- ✅ **Unit Testing**: Comprehensive tests for 3+ components
- ✅ **Pagination**: Load more functionality for character lists
- ✅ **Local Storage**: Persistence for favorites and comments
- ✅ **GraphQL Integration**: Efficient data fetching with Apollo Client

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Hooks
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: GraphQL with Apollo Client
- **Routing**: React Router DOM v6
- **Testing**: Jest & React Testing Library
- **Icons**: Lucide React
- **State Management**: React Context & Custom Hooks
- **Code Quality**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/rick-and-morty-app.git
cd rick-and-morty-app
Install dependencies

bash
npm install
Start the development server

bash
npm run dev
Open your browser and navigate to http://localhost:5173

Available Scripts
npm run dev - Start development server

npm run build - Build for production

npm run preview - Preview production build

npm run test - Run test suite

npm run test:watch - Run tests in watch mode

npm run lint - Run ESLint

npm run format - Format code with Prettier

📱 Application Features
🎨 Design & UI
Responsive grid layout adapting to all screen sizes

Custom color palette matching design specifications

Smooth transitions and hover effects

Consistent spacing and typography

Accessible components with proper ARIA labels

🔍 Search & Filtering
Search by Name: Real-time character search

Filter by Status: Alive, Dead, or Unknown

Filter by Species: Human, Alien, Humanoid, Animal, etc.

Filter by Gender: Male, Female, Genderless, Unknown

Combined Filters: Apply multiple filters simultaneously

⭐ Favorites System
Click star icon to add/remove from favorites

Favorites persist across browser sessions

Visual distinction for favorited characters

Count display for total favorites

💬 Comments System
Add comments to any character

View comment history per character

Comments stored locally and persist

Simple and intuitive comment interface

🗑️ Soft Delete
Remove characters temporarily from view

No permanent data deletion

Visual feedback for deleted items

Can be restored via UI (if implemented)

📊 Data Management
GraphQL queries for efficient data fetching

Apollo Client for state management

Local storage integration for user data

Error handling and loading states

🧪 Testing
The project includes comprehensive unit tests covering:

CharacterCard Component: Rendering, interactions, props

CharacterList Component: Data display, sorting, filtering

Filters Component: Filter functionality, user interactions

Custom Hooks: Favorites, comments, and data fetching logic

Run the test suite:

bash
npm test
View test coverage:

bash
npm run test:coverage
🔧 Project Configuration
Tailwind CSS
Custom theme configuration with project-specific colors:

javascript
theme: {
  extend: {
    colors: {
      primary: {
        100: '#E3F2FD',
        600: '#1E88E5',
        700: '#1976D2',
      },
      secondary: {
        600: '#7B1FA2',
      }
    }
  }
}
TypeScript
Strict TypeScript configuration with comprehensive type definitions for:

Character data interfaces

API response types

Component props

Custom hook return types

GraphQL
Apollo Client setup with:

Efficient caching strategy

Error handling

Loading states

Type-safe queries and mutations

📁 Key Components
CharacterList: Main component displaying character grid with sorting

CharacterCard: Individual character card with all interactive features

Filters: Advanced filtering component with multiple filter types

CharacterDetail: Detailed character view with all information

Layout: Main application layout with responsive design

Custom Hooks: Reusable logic for favorites, comments, and data fetching

🚀 Performance Optimizations
Code Splitting: React.lazy for route-based splitting

Image Optimization: Proper sizing and lazy loading

Memoization: React.memo and useMemo for expensive computations

Bundle Optimization: Tree-shaking and minimal dependencies

Efficient Rendering: Virtualized lists for large datasets (if needed)

🔒 Best Practices Implemented
Type Safety: Full TypeScript implementation

Component Composition: Reusable, composable components

Custom Hooks: Logic separation and reusability

Error Boundaries: Graceful error handling

Accessibility: Semantic HTML and ARIA labels

Responsive Images: srcset and proper sizing

SEO Friendly: Meta tags and structured data

📈 API Integration
The application integrates with the Rick and Morty GraphQL API using:

GraphQL Queries: Efficient data fetching with only needed fields

Pagination: Handle large datasets with cursor-based pagination

Error Handling: Network error and API error handling

Loading States: Skeleton loaders and progress indicators

🎯 Deployment
The application can be deployed to any static hosting service:

bash
# Build for production
npm run build

# The build output will be in the 'dist' directory
Recommended hosting platforms:

Vercel

Netlify

GitHub Pages

AWS S3 + CloudFront

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Commit Convention
feat: New feature

fix: Bug fix

docs: Documentation

style: Formatting

refactor: Code refactoring

test: Testing

chore: Maintenance

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Rick and Morty API for providing the data

The creators of all the amazing open-source tools used in this project

The design team for the Figma mockups

📞 Support
For questions or issues, please:

Check the existing documentation

Search for similar issues in the repository

Create a new issue with detailed information

<div align="center">
Built with ❤️ using modern web technologies

⭐ Star this repo if you find it useful! ⭐

</div> ```