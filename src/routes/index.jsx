import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/layout/Header";

// Pages
import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Courses from "../pages/Courses";
import Articles from "../pages/Articles";
import Webinars from "../pages/Webinars";
import Workshop from "../pages/Workshop";
import ResearchPaper from "../pages/ResearchPaper";
import Ebook from "../pages/Ebook";
import NewCourse from "../pages/Newcourse";
import ArticleCreate from "../pages/ArticleCreate";
import ArticleEdit from "../pages/ArticleEdit";
import EbookCreate from "../pages/EbookCreate";
import EbookEdit from "../pages/EbookEdit";
import Newsletter from "../pages/Newsletter";
import NewsletterCreate from "../pages/NewsletterCreate";
import NewsletterEdit from "../pages/NewsletterEdit";
import CaseStudy from "../pages/CaseStudy";
import CaseStudyCreate from "../pages/CaseStudyCreate";
import CaseStudyEdit from "../pages/CaseStudyEdit";
import ResearchPaperCreate from "../pages/ResearchPaperCreate";
import ResearchPaperEdit from "../pages/ResearchPaperEdit";
import WorkshopCreate from "../pages/WorkshopCreate";
import WorkshopEdit from "../pages/WorkshopEdit";
import Quiz from "../pages/Quiz";
import CourseDetail from "../pages/CourseDetail";
import Sales from "../pages/Sales";
import SliderManagement from "../pages/SliderManagement";
import Feedback from "../pages/FeedBack";
import { Toaster } from "react-hot-toast";

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/create"
          element={
            <ProtectedRoute>
              <ArticleCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:id/edit"
          element={
            <ProtectedRoute>
              <ArticleEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/webinars"
          element={
            <ProtectedRoute>
              <Webinars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <ProtectedRoute>
              <Workshop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops/create"
          element={
            <ProtectedRoute>
              <WorkshopCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops/:id/edit"
          element={
            <ProtectedRoute>
              <WorkshopEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newsletters"
          element={
            <ProtectedRoute>
              <Newsletter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newsletters/create"
          element={
            <ProtectedRoute>
              <NewsletterCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newsletters/:id/edit"
          element={
            <ProtectedRoute>
              <NewsletterEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/case-studies"
          element={
            <ProtectedRoute>
              <CaseStudy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/case-studies/create"
          element={
            <ProtectedRoute>
              <CaseStudyCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/case-studies/:id/edit"
          element={
            <ProtectedRoute>
              <CaseStudyEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/research-papers"
          element={
            <ProtectedRoute>
              <ResearchPaper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/research-papers/create"
          element={
            <ProtectedRoute>
              <ResearchPaperCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/research-papers/:id/edit"
          element={
            <ProtectedRoute>
              <ResearchPaperEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebooks"
          element={
            <ProtectedRoute>
              <Ebook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebooks/create"
          element={
            <ProtectedRoute>
              <EbookCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ebooks/:id/edit"
          element={
            <ProtectedRoute>
              <EbookEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-course"
          element={
            <ProtectedRoute>
              <NewCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slider"
          element={
            <ProtectedRoute>
              <SliderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
