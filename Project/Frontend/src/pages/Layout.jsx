import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Layout = ()  => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow mt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout
