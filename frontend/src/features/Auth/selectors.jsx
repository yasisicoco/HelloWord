import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

export const useAuth = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const dispatch = useDispatch();

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken && !accessToken) {
    }
  }, [dispatch, accessToken]);

  return accessToken;
};
