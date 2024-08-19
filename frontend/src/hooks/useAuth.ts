import { checkSignedIn } from '@/apis/authApi';
import { NAVIGATION_PAGE, NOT_NEEDS_SIGNED_IN_PAGE } from '@/constants/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const isInNotNeedingAuthPage = useMemo(
    () => NOT_NEEDS_SIGNED_IN_PAGE.includes(location.pathname),
    [location],
  );

  const authRouting = useCallback(async () => {
    const isAuth = await checkSignedIn();
    setIsSignedIn(isAuth);

    if (isAuth && isInNotNeedingAuthPage) navigate(NAVIGATION_PAGE.readingRecords.list);
    if (!isAuth && !isInNotNeedingAuthPage) navigate(NAVIGATION_PAGE.auth.signIn);
  }, [setIsSignedIn, isInNotNeedingAuthPage, navigate]);

  useEffect(() => {
    authRouting();
  }, [authRouting]);

  return {
    isSignedIn,
  };
};
