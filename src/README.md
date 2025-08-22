# E-Testi Project Structure

This project follows a clean separation between **Pages** (route-level components) and **Components** (reusable UI elements).

## 📁 Project Structure

```
src/
├── pages/                 # Route-level components (Pages)
│   ├── Dashboard.tsx      # Main dashboard page
│   ├── Settings.tsx       # User settings page
│   ├── Tips.tsx          # Study tips page
│   ├── ExamInterface.tsx # Exam taking interface
│   ├── TestResults.tsx   # Test results display
│   ├── TestTaking.tsx    # Test taking interface
│   ├── SubjectSelection.tsx # Subject selection page
│   ├── TestList.tsx      # List of available tests
│   └── index.ts          # Pages barrel export
│
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   ├── forms/            # Form components
│   │   ├── AuthModal.tsx
│   │   └── index.ts
│   ├── common/           # Common utility components
│   │   ├── InteractiveGraph.tsx
│   │   └── index.ts
│   └── index.ts          # Components barrel export
│
├── ui/                   # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ... (other UI primitives)
│
├── styles/               # Global styles and CSS
├── assets/               # Static assets
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## 🎯 Architecture Principles

### **Pages** (`src/pages/`)
- **Purpose**: Route-level components that represent entire screens/views
- **Characteristics**: 
  - Contain business logic and state management
  - Import and compose multiple components
  - Handle routing and navigation
  - Manage data fetching and API calls
- **Examples**: Dashboard, Settings, ExamInterface

### **Components** (`src/components/`)
- **Purpose**: Reusable UI elements that can be shared across pages
- **Categories**:
  - **Layout**: Navigation, headers, footers, sidebars
  - **Forms**: Input components, modals, form wrappers
  - **Common**: Utility components like charts, graphs, widgets
- **Characteristics**:
  - Pure UI components with minimal business logic
  - Accept props for customization
  - Can be easily tested in isolation
  - Follow composition patterns

### **UI Components** (`src/ui/`)
- **Purpose**: Low-level UI primitives (shadcn/ui)
- **Characteristics**:
  - Atomic design components
  - Highly reusable and configurable
  - Minimal dependencies
  - Consistent design system

## 🔄 Import Patterns

### Importing Pages
```typescript
// From pages index
import { Dashboard, Settings, Tips } from './pages';

// Or directly
import { Dashboard } from './pages/Dashboard';
```

### Importing Components
```typescript
// From components index
import { Navigation, AuthModal, InteractiveGraph } from './components';

// Or from specific category
import { Navigation } from './components/layout';
import { AuthModal } from './components/forms';
```

### Importing UI Components
```typescript
import { Button, Card, Badge } from './ui';
```

## 🚀 Benefits of This Structure

1. **Clear Separation**: Easy to distinguish between pages and reusable components
2. **Maintainability**: Changes to pages don't affect reusable components
3. **Reusability**: Components can be easily shared across different pages
4. **Testing**: Components can be tested in isolation
5. **Scalability**: Easy to add new pages or components without affecting existing code
6. **Team Collaboration**: Different developers can work on different layers

## 📝 Adding New Components

### Adding a New Page
1. Create the component in `src/pages/`
2. Export it from `src/pages/index.ts`
3. Add it to the routing logic in `App.tsx`

### Adding a New Reusable Component
1. Determine the category (layout, forms, common)
2. Create the component in the appropriate directory
3. Export it from the category's `index.ts`
4. Export it from `src/components/index.ts`

### Adding a New UI Component
1. Create the component in `src/ui/`
2. Follow shadcn/ui patterns
3. Export it from `src/ui/index.ts` (if you create one)