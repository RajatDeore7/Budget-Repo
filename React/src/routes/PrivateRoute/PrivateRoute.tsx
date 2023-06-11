import { Spin } from '@/components/Spin';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTE_PATH } from '@/constants/RoutePath.constant.ts';

const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth?.initialing ? (
    <Spin size='large' />
  ) : auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to={`/${ROUTE_PATH.LOGIN}`} state={{ from: location }} replace />
  );
};

export default PrivateRoute;
