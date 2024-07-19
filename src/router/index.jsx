import Home from "@/views/home";
import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
const Login = lazy(() => import("@/views/login"));
const Page1 = lazy(() => import("@/views/page1"));

const withLoadingComponent = (comp) => (
  <React.Suspense fallback={<div>Loading...</div>}>{comp}</React.Suspense>
);

const routes = [
  {
    path: "/",
    element: <Navigate to="/page1" />,
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/page1",
        element: withLoadingComponent(<Page1 />),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/page1" />,
  },
];

export default routes;
