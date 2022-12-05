import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Admin from './Admin';
import {
  BrowserRouter,
  Routes,
  Route,
  useRoutes
} from 'react-router-dom'
import { Home } from './Home';
import { PageNotFound } from './PageNotFound';
import { ViewPage } from './ViewPage'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
        <Route index element={<Home />} />
        <Route path="admin/:adminId" element={<Admin />} />
        <Route path="view/:viewId" element={<ViewPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
      
  </React.StrictMode>
);

// If you want to start measuring performance in your Admin, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals