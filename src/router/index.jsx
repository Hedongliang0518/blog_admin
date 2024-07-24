import NotFind from '@/views/404';
import Layout from '@/views/layout';
import Login from '@/views/login';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
const Home = lazy(() => import('@/views/home'));
const Write = lazy(() => import('@/views/system/write'));
const User = lazy(() => import('@/views/system/user'));
const Role = lazy(() => import('@/views/system/role'));
const Menu = lazy(() => import('@/views/system/menu'));
const Article = lazy(() => import('@/views/content/article'));

const withLoadingComponent = (comp) => <React.Suspense fallback={<div>Loading...</div>}>{comp}</React.Suspense>;

const routes = [
  {
    path: '/',
    element: <Navigate to='/home' />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/home',
        element: withLoadingComponent(<Home />),
      },
      {
        path: '/write',
        element: withLoadingComponent(<Write />),
      },
      {
        path: '/user',
        element: withLoadingComponent(<User />),
      },
      {
        path: '/role',
        element: withLoadingComponent(<Role />),
      },
      {
        path: '/menu',
        element: withLoadingComponent(<Menu />),
      },
      {
        path: '/article',
        element: withLoadingComponent(<Article />),
      },
      {
        path: '*',
        element: <NotFind />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
];

export default routes;
