import { AuthService } from '@/services/Auth.service';
import { UserService } from '@/services/User.service';
import { LOCAL_STORAGE_KEY } from '@/constants/common';
import React, { useEffect, useState } from 'react';
// import { FORBIDDEN } from 'routes/routes';

interface AuthContextType {
  initialing: boolean;
  user: any;
  login: (data: any) => void;
  logout: (options?: any) => void;
  register: any;
  resetPassword: any;
  newPassword: any;
}

export interface LocationTypeLogin {
  state: {
    from: {
      pathname: string;
    };
  };
}

const AuthContext = React.createContext<AuthContextType>({
  initialing: true,
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login: () => { },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => { },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  register: () => { },

  resetPassword: () => { },

  newPassword: () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [initialing, setInitialing] = useState<boolean>(true);

  useEffect(() => {
    const _getUser = async () => {
      try {
        const user = await UserService.getUserProfile();
        setUser(user.data);
        // setUser({});
      } finally {
        setInitialing(false);
      }
    }
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN) || undefined; //TODO: use cookie https instead
    if (token) {
      _getUser();
    } else {
      setInitialing(false);
    }
  }, []);

  const _login = async (data: any) => {
    const result = await AuthService.login(data);
    localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, result.data.token);
    const user = await UserService.getUserProfile();
    setUser(user.data);
    // setUser({});
    return result;
  };

  const _logout = (_?: any) => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
    setUser(null);
  };
  const _register = (data: any) => {
    return AuthService.register(data);
  }

  const _resetPassword = (data: any) => {
      return AuthService.resetPassword(data);
  }

  const _newPassword = (data: any) => {
    return AuthService.newPassword(data)
  }


  const value = {
    initialing,
    user,
    login: _login,
    logout: _logout,
    register: _register,
    resetPassword: _resetPassword,
    newPassword: _newPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
