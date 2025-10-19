import { createBrowserRouter } from "react-router";

import Example from "@/pages/example/example";
// import Index from '@/pages/Index'
import Login from "@/pages/login/ui/Login";
import Notfound from "@/pages/Notfound";
import Layout from "@/widgets/Layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/example",
    element: (
      <Layout>
        <Example />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <Notfound />
      </Layout>
    ),
  },
]);

export default router;
