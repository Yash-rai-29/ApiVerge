# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



apiverge/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── auth.js             // API helper functions for authentication
│   ├── assets/                 // Images, icons, fonts, etc.
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx      // Common header for public pages
│   │   │   ├── Footer.jsx      // Common footer for public pages
│   │   │   └── Sidebar.jsx     // Optional sidebar for protected pages
│   │   │   └── Notification.jsx
│   │   └── layout/
│   │       ├── PublicLayout.jsx    // Layout for public landing pages
│   │       └── ProtectedLayout.jsx // Layout for authenticated pages (includes sidebar, header, etc.)
│   ├── contexts/
│   │   └── AuthContext.jsx     // Provides global authentication state and actions
│   │   └── DataContext.jsx
│   │   └── QueryContext.jsx
│   ├── pages/
│   │   ├── public/             // Public landing pages
│   │   │   ├── Home.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Solutions.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Terms.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── SignUp.jsx      // Public sign-up page
│   │   │   └── Login.jsx       // Public login page
│   │   └── protected/          // Authenticated pages
│   │       ├── Dashboard.jsx
│   │       ├── Team.jsx
│   │       ├── Settings.jsx
│   │       ├── Profiles.jsx
│   │       ├── Projects.jsx
│   │       └── Billings.jsx
│   ├── routes/
│   │   └── PrivateRoute.jsx    // Wrapper to protect routes requiring authentication
│   │   └── PublicOnlyRoute.jsx  
|   ├── stores/
│   │   └── projectStore.jsx  
│   │   └── uiStore.jsx  
|   ├── hooks
|   |   └── useProjects.jsx  
│   ├── utils/
│   │   └── firebaseInit.js     // Firebase configuration here
│   ├── App.jsx                 // Main routing setup
│   ├── main.jsx                // Application entry point
│   └── index.css               // Global styles (including Tailwind CSS)
├── package.json
└── tailwind.config.js


<!-- firebase deploy --only hosting:apiverge -->