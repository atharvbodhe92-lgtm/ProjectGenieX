import { Landing, ProjectTitles, ProjectTitlesInfo } from '@/pages'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import ForgotPassword from '@/pages/auth/ForgetPassword'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/SignUp'
import Layout from '@/pages/Layout'
import Plan from '@/pages/Plan'
import ResearchPaperRecommend from '@/pages/ResearchPaperRecommend'
import { store } from '@/redux/store'
import { Provider } from 'react-redux'
import { Route,Routes } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'


const Routing = () => {

  return (
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/generate_titles" element={<ProjectTitles />} />
          <Route path="/project_titles_info" element={<ProjectTitlesInfo/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/sign-up" element={<Signup/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/forget-password" element={<ForgotPassword/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/researchpaper" element={<ResearchPaperRecommend/>} />
          <Route path="/view-plan/:id?" element={  <Plan/>} />
        </Route>
      </Routes>
    </Provider>
  )
}

export default Routing
