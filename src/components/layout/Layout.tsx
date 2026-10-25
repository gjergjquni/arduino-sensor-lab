import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout() {
  return (
    <>
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
