import { NextUIProvider } from '@nextui-org/system';
import { AdminPanel } from './module/admin-panel';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Game } from './module/game';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminPanel />,
  },
  {
    path: '/game',
    element: <Game />,
  },
]);

export const Providers = () => {
  return (
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  );
};
