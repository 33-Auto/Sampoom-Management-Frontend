import { createBrowserRouter } from 'react-router'

import Layout from '@/widgets/Layout/Layout'
import Index from '@/pages/Index'
import Example from '@/pages/example/example'
import Notfound from '@/pages/Notfound'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Index />
      </Layout>
    ),
  },
  {
    path: '/example',
    element: (
      <Layout>
        <Example />
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <Notfound />
      </Layout>
    ),
  },
])

export default router
