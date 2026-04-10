
import React from 'react';
import { ProvedorAutenticacao } from './context/AuthContext';

export default function AppWrapper({ children }) {
  return <ProvedorAutenticacao>{children}</ProvedorAutenticacao>;
}
