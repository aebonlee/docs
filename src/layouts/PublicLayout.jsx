import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useAOS from '../hooks/useAOS'

const Home = lazy(() => import('../pages/Home'))
const Category = lazy(() => import('../pages/Category'))
const Viewer = lazy(() => import('../pages/Viewer'))
const NotFound = lazy(() => import('../pages/NotFound'))

function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  )
}

export default function PublicLayout() {
  useAOS()

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/view/:docId" element={<Viewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
