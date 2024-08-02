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
const Category = lazy(() => import('@/views/content/category'));
const Link = lazy(() => import('@/views/content/link'));
const Tag = lazy(() => import('@/views/content/tag'));
const Photo = lazy(() => import('@/views/content/photo'));

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
        path: '/photos',
        element: withLoadingComponent(<Photo />),
      },
      {
        path: '/category',
        element: withLoadingComponent(<Category />),
      },
      {
        path: '/link',
        element: withLoadingComponent(<Link />),
      },
      {
        path: '/tag',
        element: withLoadingComponent(<Tag />),
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
