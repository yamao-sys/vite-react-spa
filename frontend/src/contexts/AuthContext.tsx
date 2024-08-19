import { useAuth } from '@/hooks/useAuth';
import { createContext, ReactNode, useContext } from 'react';

type ContextType = {
  isSignedIn: boolean;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext({} as ContextType);

export const AuthProvider = ({ children }: Props) => {
  const { isSignedIn } = useAuth();

  return <AuthContext.Provider value={{ isSignedIn }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext); // eslint-disable-line react-refresh/only-export-components
