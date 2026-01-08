import {Navigate, type RouteObject} from "react-router-dom";
import AuthPageFC from "@/views/AuthPage";
import NotFoundFC from "@/views/404";
import ForbiddenPageFC from "@/views/403";
import BadGatewayFC from "@/views/502";
import LayoutFC from "@/layout";

export const staticRoutes: RouteObject[] = [
    {
        id: "layout",
        path: "/layout",
        element: <LayoutFC/>,
        children: [

        ],
    },
    {
        id: "facade",
        path: "/",
        element: <AuthPageFC />,
    },
    { path: "/404", element: <NotFoundFC/> },
    { path: "/403", element: <ForbiddenPageFC /> },
    { path: "/502", element: <BadGatewayFC /> },
    { path: "*", element: <Navigate to="/404" /> },
];