import './App.css'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import EmployerDashboard from './pages/EmployerDashboard'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import JobForm from './components/JobForm'
import EmployerJobList from './components/EmployerJobList'
import MyApplications from './pages/MyApplications'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/post-job" element={<JobForm />} />
        <Route path="/edit-job/:id" element={<JobForm />} />
        <Route path="/employer-dashboard" element={<EmployerJobList />} />
        <Route path="/my-applications" element={<MyApplications />} />
      </Routes>
    </>
  )
}

export default App
