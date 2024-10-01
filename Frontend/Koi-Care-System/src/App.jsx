/* eslint-disable no-unused-vars */
import { useRoutes } from 'react-router-dom'
import path from './constants/path'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Member from './pages/Member/Member'
import Shop from './pages/Shop/Shop'
import Dashboard from './pages/Member/Dashboard/Dashboard'
import MyKoi from './pages/Member/MyKoi/MyKoi'
import WaterParameters from './pages/Member/WaterParameters/WaterParameters'
import Reminders from './pages/Member/Reminders/Reminders'
import Recommendations from './pages/Member/Recommendations/Recommendations'
import FoodCalculator from './pages/Member/FoodCalculator/FoodCalculator'
import SaltCalculator from './pages/Member/SaltCalculator/SaltCalculator'
import Statistics from './pages/Member/Statistics/Statistics'
import News from './pages/Member/News/News'
import MyAccount from './pages/Member/MyAccount/MyAccount'
import Profile from './pages/Member/MyAccount/Profile/Profile'
import ShopCart from './pages/Member/MyAccount/ShopCart/ShopCart'
import MyPond from './pages/Member/MyPond/MyPond'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import VerifySuccess from './pages/VerifyEmail/VerifySuccess'
import { DarkModeProvider } from './components/DarkModeContext'
import Policy from './pages/Policy/Policy'
import NewsDetail from './pages/Member/News/NewsDetail'
import Email from './pages/RecoveryPassword/Email'
import OTP from './pages/OTP/OTP'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import KoiDetail from './pages/Member/MyKoi/KoiDetail'
import About from './pages/Member/About/About'
import RecommendationDetail from './pages/Member/Recommendations/RecommendationDetail'
import MyPondLog from './pages/Member/MyPond/MyPondLog'
import ShopNews from './pages/Shop/News/ShopNews'
import CreateNews from './pages/Shop/News/CreateNews'
import UpdateNews from './pages/Shop/News/UpdateNews'
import ViewNews from './pages/Shop/News/ViewNews'
import './index.css'
import MyPondLogId from './pages/Member/MyPond/MyPondLogId'

function App() {
  const routeElements = useRoutes([
    {
      path: path.home,
      element: <Home />
    },
    {
      path: path.login,
      element: <Login />
    },
    {
      path: path.register,
      element: <Register />
    },
    {
      path: path.policy,
      element: <Policy />
    },
    {
      path: path.verify,
      element: <VerifyEmail />
    },
    {
      path: path.verifySuccess,
      element: <VerifySuccess />
    },
    {
      path: path.email,
      element: <Email />
    },
    {
      path: path.otp,
      element: <OTP />
    },
    {
      path: path.resetPassword,
      element: <ResetPassword />
    },
    {
      path: path.member,
      element: <Member />
    },
    {
      path: path.myAccount,
      element: <MyAccount />
    },
    {
      path: path.profile,
      element: <Profile />
    },
    {
      path: path.shopCart,
      element: <ShopCart />
    },
    {
      path: path.dashboard,
      element: <Dashboard />
    },
    {
      path: path.myKoi,
      element: <MyKoi />
    },
    {
      path: path.myPond,
      element: <MyPond />
    },
    {
      path: path.waterParameters,
      element: <WaterParameters />
    },
    {
      path: path.reminders,
      element: <Reminders />
    },
    {
      path: path.recommendations,
      element: <Recommendations />
    },
    {
      path: path.foodCalculator,
      element: <FoodCalculator />
    },
    {
      path: path.saltCalculator,
      element: <SaltCalculator />
    },
    {
      path: path.statistics,
      element: <Statistics />
    },
    {
      path: path.news,
      element: <News />
    },
    {
      path: path.newsDetails,
      element: <NewsDetail />
    },
    {
      path: path.koiDetail,
      element: <KoiDetail />
    },
    {
      path: path.recommendationDetail,
      element: <RecommendationDetail />
    },
    {
      path: path.aboutMember,
      element: <About />
    },
    {
      path: path.myPondLog,
      element: <MyPondLog />
    },
    {
      path: path.shop,
      element: <Shop />
    },
    {
      path: path.shopNews,
      element: <ShopNews />
    },
    {
      path: path.createNews,
      element: <CreateNews />
    },
    {
      path: path.updateNews,
      element: <UpdateNews />
    },
    {
      path: path.viewNews,
      element: <ViewNews />
    },
    {
      path: path.myPondLogDetail,
      element: <MyPondLogId />
    }
  ])

  const data = [
    {
      Id: 2,
      Subject: 'Meeting',
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 12, 30),
      IsAllDay: false,
      Status: 'Completed',
      Priority: 'High'
    }
  ]
  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject' },
    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    endTime: { name: 'EndTime' }
  }
  const eventSettings = { dataSource: data, fields: fieldsData }

  return (
    <>
      <DarkModeProvider>
        {routeElements}

        <ToastContainer />
      </DarkModeProvider>
    </>
  )
}

export default App
