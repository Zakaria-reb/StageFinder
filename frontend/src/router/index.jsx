import { createBrowserRouter } from "react-router-dom";
import Home from "../page/Home";
import Register from "../page/Register";
import Users from "../page/Users";
import Layout from "../layouts/Layout";
import '../axiosConfig'; // Pour appliquer la configuration globale d'axios
import Dashboard from "../page/Dashboard";
import Offre from "../page/Offre";
import PostDetail from "../page/PostDetail";
import NewPost from "../page/NewPost";
import EditPost from "../page/EditPost";
import ApplicationDetails from "../page/ApplicationDetails";
import ApplicationRecue from "../page/Application"; // Importation du composant ApplicationRecue

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path:'/',
                element: <Home />
            },
            {
                path:'/Dashboard',
                element: <Dashboard />
            },
            {
                path:'/Offre',
                element: <Offre />
            },
            {
                path:'/PostDetail/:id',
                element: <PostDetail />
            },
            {
                path:'/applications/:id',
                element: <ApplicationDetails />
            },
            {
                path:'/application-details/:id',
                element: <ApplicationDetails />
            },
            {
                path:'/posts/edit/:id',
                element: <EditPost />
            },
            {
                path:'/register',
                element: <Register />
            },
            {
                path:'/users',
                element: <Users />
            },
            {
                path:'/posts/new',
                element: <NewPost />
            },
            {
                path:'/applications-recues',
                element: <ApplicationRecue />
            },
            {
                path:'*',
                element: <div>Not Found</div>
            }
        ]
    }
])