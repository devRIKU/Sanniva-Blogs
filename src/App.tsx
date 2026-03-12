/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Post from './pages/Post';
import AllBlogs from './pages/AllBlogs';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';
import Settings from './pages/admin/Settings';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="post/:slug" element={<Post />} />
              <Route path="all-posts" element={<AllBlogs />} />
              <Route path="login" element={<Login />} />
              <Route path="admin">
                <Route index element={<Dashboard />} />
                <Route path="editor" element={<Editor />} />
                <Route path="editor/:id" element={<Editor />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
