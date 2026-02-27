## Smart Waste Management System – Client

Frontend dashboard for the **Smart Waste Management System (SWMS)** built with React and Vite.  
It provides real‑time monitoring and administration of trash containers, users (admins / employees), and routing visualizations on an interactive map.

---

### Features

- **Authentication‑aware layout**
  - Reads the logged‑in user from `localStorage` (`profile`) and shows either the login screen or the main dashboard layout.
- **Admin & employee management**
  - CRUD UI for users, with a dedicated **Admin** and **Employee** pages.
  - Role‑aware actions (e.g. admin‑only controls).
- **Trash container management**
  - List, create, and edit trash containers (type, region, max capacity, current capacity, full/empty).
  - Separate modal flows for adding and confirming/clearing full containers.
- **Dashboard overview**
  - KPI cards for admins, employees, trash count, and full trash count.
  - “Top trash” table (highest capacity this month).
  - Carousel and table views of trash containers.
- **HERE Maps route visualization**
  - `MapsLayout` renders trash locations and the main office on a HERE map.
  - Displays an optimized route that passes through all “full” containers.
- **Theming**
  - Light/dark theme toggle, persisted in `localStorage`.
- **Reusable UI components**
  - Dropdowns, top navigation with user menu, sidebar, modals, tables, carousels, and cards.

---

### Tech Stack

- **Framework**: React 18 + Vite
- **State Management**: Redux (`redux`, `react-redux`, `redux-thunk`)
- **Routing**: `react-router-dom`
- **Maps / Routing**: HERE Maps JavaScript API
- **Styling**: CSS + `styled-components` (for carousel), Boxicons
- **UI/UX Enhancements**: `typewriter-effect`, `react-slick` / `slick-carousel`
- **Tooling**: ESLint, Vite build tooling

---

### Getting Started

#### Prerequisites

- Node.js **18+** (recommended)
- npm (bundled with Node)

#### Installation

```bash
# from the repo root
cd client
npm install
```

#### Environment Variables

The HERE Maps integration uses a Vite env variable:

- **`VITE_HERE_API_KEY`** – HERE Maps API key used by `MapsLayout`.

Create a `.env` file in the `client` folder:

```bash
VITE_HERE_API_KEY=your_here_maps_api_key
```

If this is not set, the app falls back to a hard‑coded demo key in `MapsLayout.jsx` (you should override it in real deployments).

#### Scripts

```bash
# Start dev server with HMR
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```

The dev server defaults to `http://localhost:5173` (Vite default) unless configured otherwise.

---

### Project Structure (high level)

```text
src/
  App.jsx                # Main app layout / routing entry
  main.jsx               # React root, Redux provider, router, login/layout switch
  reportWebVitals.js     # Web vitals integration

  assets/                # Images, icons, fonts, global styles
  components/
    layout/              # Main layout (sidebar + topnav + content)
    topnav/              # Top navigation bar with user menu & theme toggle
    sidebar/             # Sidebar and navigation items
    dropdown/            # Generic dropdown component
    thememenu/           # Theme switcher (light/dark)
    modal/               # Reusable modal component
    status-card/         # KPI cards
    table/               # Generic table component
    carousel/            # React-slick based carousel
    mapslayout/          # HERE Maps embedding and routing

  pages/
    Dashboard.jsx        # Overview metrics + trash profile
    Admin.jsx            # Admin management
    Employee.jsx         # Employee management
    Trash.jsx            # Trash container CRUD and views

  redux/
    actions/             # Thunk actions for User, Trash, Theme, etc.
    reducers/            # Root reducer and domain reducers
```

Exact contents may evolve, but this is the conceptual layout.

---

### Data & Authentication Model (client‑side)

- **Authentication**
  - The app expects a `profile` object in `localStorage`, typically set after login by the backend.
  - `profile.result.user_isAdmin` is used to determine admin vs. employee permissions.
- **Redux state**
  - `state.User`: list of users (admins and employees).
  - `state.Trash`: list of trash containers, including current capacity, region, and “full” status.
  - `state.Theme`: current theme mode (light/dark).

The client assumes APIs are already wired in the Redux actions (`redux/actions/*`); configure those to point to your backend.

---

### Code Quality & Conventions

- **ESLint** is configured and should pass with:

```bash
npm run lint
```

- React Hooks usage follows the official rules (no ref access in render, no `setState` in effects used for simple derivations, dependency arrays kept minimal and safe).
- The HERE Maps effect in `MapsLayout.jsx` intentionally ignores `trashData` dependencies to avoid excessive rerenders; the linter warning is acceptable as long as you understand this trade‑off.

---

### Deployment Notes

- Build the app:

```bash
npm run build
```

- Serve the `dist` directory with any static file server (Nginx, Apache, Vercel, Netlify, etc.).
- Ensure your production environment provides **`VITE_HERE_API_KEY`** and any backend API URLs your Redux actions rely on.

---

### Troubleshooting

- **Blank screen / redirect to login**
  - Check that `localStorage.getItem('profile')` returns a valid JSON object with a `result` field.
- **HERE Maps not loading**
  - Verify `VITE_HERE_API_KEY` is set and valid.
  - Confirm the HERE Maps script is loaded and `window.H` is available in the browser.
- **Build errors about missing modules**
  - Run `npm install` again to ensure all dependencies in `package.json` are installed.

---

### License

This client is intended for use as part of the Smart Waste Management System.  
Adapt the license section here to match your organization’s licensing strategy.
