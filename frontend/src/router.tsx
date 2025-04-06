import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import PortfolioItemPage from './pages/PortfolioItemPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProfilePage from './pages/admin/ProfilePage';
import PortfolioItemsPage from './pages/admin/PortfolioItemsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ContactMessagesPage from './pages/admin/ContactMessagesPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/portfolio/:id',
    element: <PortfolioItemPage />,
  },
  
  // Admin routes
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <DashboardPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/profile',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ProfilePage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/portfolio-items',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <PortfolioItemsPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/categories',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <CategoriesPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/messages',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <ContactMessagesPage />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
]); 