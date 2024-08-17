import App from '@/App';
import { NotFound } from '@/components/organisms/NotFound';
import { SignUpPage } from '@/pages/auth/sign_up';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth/sign_up',
    element: <SignUpPage />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
]);
