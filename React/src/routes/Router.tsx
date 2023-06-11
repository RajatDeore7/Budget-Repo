import { Spin } from "@/components/Spin/Spin";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import { useLocation, Navigate, Routes, Route } from "react-router-dom";
import { Login } from "@/pages/Login/Login";
import { useAuth } from "@/hooks/useAuth";
import { Register } from "@/pages/Register/Register";
import { ForgotPassword } from "@/pages/ForgotPassword/ForgotPassword";
import { NewPassword } from "@/pages/NewPassword/NewPassword";
import { AdminLayout } from "@/layouts/AdminLayout";
// import Portfolio from "@/pages/portfolio/Portfolio";
import { ROUTE_PATH } from '@/constants/RoutePath.constant.ts';
import Budgets from '@/pages/Budgets/Budgets.tsx';
// import AssetLiabilities from '@/pages/Asset-Liabilities/Asset-Liabilities.tsx';
import Activate from '@/pages/Activate/Activate.tsx';

export const Router = () => {
  const auth = useAuth();
  const location = useLocation();
  return (
    <Routes>
      <Route
        path={`/${ROUTE_PATH.LOGIN}`}
        element={
          auth?.initialing ? (
            <Spin size="large" />
          ) : auth?.user ? (
            <Navigate to={`/${ROUTE_PATH.HOME}`} state={{ from: location }} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path={`/${ROUTE_PATH.REGISTER}`}
        element={
          auth?.initialing ? (
            <Spin size="large" />
          ) : auth?.user ? (
            <Navigate to={`/${ROUTE_PATH.HOME}`} state={{ from: location }} replace />
          ) : (
            <Register />
          )
        }
      />

      <Route
      path={`/${ROUTE_PATH.FORGOT_PASSWORD}`}
      element={
          <ForgotPassword />
      }
      />
      <Route path={`/${ROUTE_PATH.ACTIVATE}/:uid/:token`} element={<Activate />} />
      <Route path={`/${ROUTE_PATH.PASSWORD_RESET_CONFIRM}/:uid/:token`} element={<NewPassword />} />
      {/* <Route path={`/${ROUTE_PATH.PORTFOLIO}`} element={<Portfolio />} /> */}
      <Route path={`/${ROUTE_PATH.HOME}`} element={<PrivateRoute />}>
          <Route path={`/${ROUTE_PATH.HOME}`} element={<AdminLayout />}>
              <Route path={ROUTE_PATH.HOME} element={ <Navigate to={`/${ROUTE_PATH.BUDGETS}`} replace /> }/>
              <Route path={ROUTE_PATH.BUDGETS} element={<Budgets />} />
              {/* <Route path={ROUTE_PATH.ASSET_LIABILITIES} element={<AssetLiabilities />} /> */}
          </Route>
      </Route>
      {/* <Route path={NOT_AUTHORIZED} element={<NotAuthorized />} />
      <Route path={FORBIDDEN} element={<Forbidden />} /> */}
    </Routes>
  );
};
