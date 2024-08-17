import App from '@/App';
import { NotFound } from '@/components/organisms/NotFound';
import { NAVIGATION_LIST } from '@/constants/navigation';
import { SignInPage } from '@/pages/auth/sign_in';
import { SignUpPage } from '@/pages/auth/sign_up';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: NAVIGATION_LIST.top,
    element: <App />,
  },
  {
    path: NAVIGATION_LIST.auth.signUp,
    element: <SignUpPage />,
  },
  {
    path: NAVIGATION_LIST.auth.signIn,
    element: <SignInPage />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
]);
