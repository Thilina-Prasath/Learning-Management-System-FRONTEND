import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./page/login";
import HomePage from "./page/Home";
import CoursePage from "./page/CoursePage";
import AllCoursesPage from "./page/AllCoursesPage";
import CourseAdminPanel from "./page/admin/CourseAdminPanel";
import MainCoursePage from "./page/Course";
import About from "./page/about";
import ReviewsPage from "./page/Review";
import ReviewAdminPanel from "./page/admin/ReviewAdminPanel";
import ProfilePage from "./page/profilePage";
import { RegisterPage } from "./page/register";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/signup" element={<RegisterPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/courses" element={<AllCoursesPage />} />
          <Route path="/course" element={<MainCoursePage />} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
       {/*<Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} /> */}
          <Route path ="/admin" element = {<CourseAdminPanel/>}/>
          <Route path ="/review" element = {<ReviewsPage/>}/>
          <Route path ="/about" element = {<About/>}/>
          <Route path ="/admin/reviews" element = {<ReviewAdminPanel/>}/>
          <Route path ="/user/profile" element = {<ProfilePage/>}/>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;