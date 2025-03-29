import { createContext } from 'react';

// Crear el contexto de autenticación con valores predeterminados
export const AuthContext = createContext({
  user: null,
  token: '',
  login: () => {},
  logout: () => {}
});