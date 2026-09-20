# Gazettar - Media Hub

A modern blog platform focused on Politics, Technology, and Entertainment news.

## Features

- 🎨 **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
- 📱 **Responsive Design** - Optimized for all device sizes
- ⚡ **Fast Performance** - Built with Vite and React 19
- 📝 **Content Management** - Powered by Sanity CMS
- 🎯 **Clean Architecture** - Minimal dependencies, maximum performance

## Tech Stack

- **Frontend**: React 19, TypeScript, React Router
- **Styling**: Tailwind CSS 4
- **CMS**: Sanity
- **Build Tool**: Vite
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Sanity CMS Setup

The Sanity Studio is located in the `gazettar` folder:

```bash
cd gazettar
npm install
npm run dev
```

## Theme Toggle

The theme toggle is implemented with:
- **ThemeContext**: React Context for global theme state
- **localStorage**: Persists user preference
- **System preference**: Auto-detects dark mode on first visit
- **Smooth transitions**: CSS-based theme switching

## Project Structure

```
hearth-media-hub/
├── src/
│   ├── components/     # Reusable components (Layout, etc.)
│   ├── contexts/       # React contexts (ThemeContext)
│   ├── pages/          # Page components (Home, ArticleDetail, Category)
│   ├── lib/            # Utilities and API clients
│   ├── data/           # Static/dummy content
│   └── types/          # TypeScript type definitions
├── gazettar/           # Sanity CMS studio
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

Private project - All rights reserved
