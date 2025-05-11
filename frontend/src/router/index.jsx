import { createBrowserRouter } from "react-router-dom";
import Home from "../page/Home";
import Register from "../page/Register";
import Users from "../page/Users";
import Layout from "../layouts/Layout";
import '../axiosConfig'; // Pour appliquer la configuration globale d'axios
import Dashboard from "../page/Dashboard";
import Offre from "../page/Offre";
import PostDetail from "../page/PostDetail";

export const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path:'/',
                element: <Home/>
            },
            {
                path:'/Dashboard',
                element: <Dashboard/>
            },
            {
                path:'/Offre',
                element: <Offre/>
            },
            {
                path:'/PostDetail/:id',
                element: <PostDetail/>
            },
            {
                path:'/register',
                element: <Register/>
            },
            {
                path:'/users',
                element: <Users/>
            },
            {
                path:'*',
                element: <h1> Not Found </h1>
            }
        ]
    }
])