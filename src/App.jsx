import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Books from "./pages/books/Books";

import HomeLayout from "./layouts/HomeLayout";
import Contact from "./pages/Contact";
import ExamPage from "./pages/exams/ExamPage.jsx";
import Exams from "./pages/exams/Exams";

import Notes from "./pages/notes/Notes";
import NotesPage from "./pages/notes/NotesPage.jsx";
import BooksPage from "./pages/books/BooksPage.jsx";
import ForgotPassword from "./pages/Modals/ForgotPassword";

import Download from "./pages/Download";
import Subscription from "./pages/Subscription";
import ExamHomePage from "./pages/ExamHomePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/books" element={<Books />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/downloads" element={<Download />} />
          <Route path="/exam/:examType/:subject/:year" element={<ExamHomePage />} />
          <Route path="/subscription" element={<Subscription />} />

          {/* Protected routes */}
          <Route
            path="/exam-content/:id"
            element={
              <ProtectedRoute element={ExamPage} />
            }
          />
          <Route
            path="/books-content/:id"
            element={
              <ProtectedRoute element={BooksPage} />
            }
          />
          <Route
            path="/notes-content/:id"
            element={
              <ProtectedRoute element={NotesPage} />
            }
          />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
