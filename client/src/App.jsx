import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//to protect routes
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import Admin from "./pages/Admin";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/helpers/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      <div className="mb-[68px]">
        <Header />
        <ScrollToTop />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
