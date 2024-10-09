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
import Tag from './pages/Shop/Tag/Tag'
import './index.css'
import MyPondLogId from './pages/Member/MyPond/MyPondLogId'
import WishList from './pages/Member/WishList/WishList'
import CartList from './pages/Member/CartList/CartList'
import CreateTag from './pages/Shop/Tag/CreateTag'
import UpdateTag from './pages/Shop/Tag/UpdateTag'
import Supplier from './pages/Shop/Supplier/Supplier'
import CreateSupplier from './pages/Shop/Supplier/CreateSupplier'
import UpdateSupplier from './pages/Shop/Supplier/UpdateSupplier'
import Checkout from './pages/Member/Recommendations/Checkout'

import Promotion from './pages/Shop/Promotion/Promotion'
import CreatePromotion from './pages/Shop/Promotion/CreatePromotion'
import UpdatePromotion from './pages/Shop/Promotion/UpdatePromotion'
import Production from './pages/Shop/Production/Production'
import CreateProduct from './pages/Shop/Production/CreateProduct'
import UpdateProduct from './pages/Shop/Production/UpdateProduct'
import Payment from './pages/Member/Recommendations/Payment'
import ProtectedRoute from './ProtectedRoute'
function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'))

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
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Member />
        </ProtectedRoute>
      )
    },
    {
      path: path.myAccount,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyAccount />
        </ProtectedRoute>
      )
    },
    {
      path: path.profile,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Profile />
        </ProtectedRoute>
      )
    },
    {
      path: path.shopCart,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ShopCart />
        </ProtectedRoute>
      )
    },
    {
      path: path.dashboard,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Dashboard />
        </ProtectedRoute>
      )
    },
    {
      path: path.myKoi,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyKoi />
        </ProtectedRoute>
      )
    },
    {
      path: path.myPond,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyPond />
        </ProtectedRoute>
      )
    },
    {
      path: path.waterParameters,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <WaterParameters />
        </ProtectedRoute>
      )
    },
    {
      path: path.reminders,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Reminders />
        </ProtectedRoute>
      )
    },
    {
      path: path.recommendations,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Recommendations />
        </ProtectedRoute>
      )
    },
    {
      path: path.foodCalculator,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <FoodCalculator />
        </ProtectedRoute>
      )
    },
    {
      path: path.saltCalculator,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <SaltCalculator />
        </ProtectedRoute>
      )
    },
    {
      path: path.statistics,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Statistics />
        </ProtectedRoute>
      )
    },
    {
      path: path.news,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <News />
        </ProtectedRoute>
      )
    },
    {
      path: path.newsDetails,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <NewsDetail />
        </ProtectedRoute>
      )
    },
    {
      path: path.koiDetail,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <KoiDetail />
        </ProtectedRoute>
      )
    },
    {
      path: path.recommendationDetail,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <RecommendationDetail />
        </ProtectedRoute>
      )
    },
    {
      path: path.aboutMember,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <About />
        </ProtectedRoute>
      )
    },
    {
      path: path.myPondLog,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyPondLog />
        </ProtectedRoute>
      )
    },
    {
      path: path.shop,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Shop />
        </ProtectedRoute>
      )
    },
    {
      path: path.shopNews,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ShopNews />
        </ProtectedRoute>
      )
    },
    {
      path: path.createNews,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CreateNews />
        </ProtectedRoute>
      )
    },
    {
      path: path.updateNews,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UpdateNews />
        </ProtectedRoute>
      )
    },
    {
      path: path.viewNews,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ViewNews />
        </ProtectedRoute>
      )
    },
    {
      path: path.myPondLogDetail,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyPondLogId />
        </ProtectedRoute>
      )
    },
    {
      path: path.tag,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Tag />
        </ProtectedRoute>
      )
    },
    {
      path: path.myPondLogDetail,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyPondLogId />
        </ProtectedRoute>
      )
    },
    {
      path: path.wishList,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <WishList />
        </ProtectedRoute>
      )
    },
    {
      path: path.cartList,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CartList />
        </ProtectedRoute>
      )
    },
    {
      path: path.payment,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Payment />
        </ProtectedRoute>
      )
    },
    {
      path: path.payment,
      element: <Payment />
    },
    {
      path: path.createTag,
      element: <CreateTag />
    },
    {
      path: path.updateTag,
      element: <UpdateTag />
    },
    {
      path: path.supplier,
      element: <Supplier />
    },
    {
      path: path.createSupplier,
      element: <CreateSupplier />
    },
    {
      path: path.updateSupplier,
      element: <UpdateSupplier />
    },
    {
      path: path.checkout,
      element: <Checkout />
    },
    {
      path: path.myPondLogDetail,
      element: <MyPondLogId />
    },
    {
      path: path.promotion,
      element: <Promotion />
    },
    {
      path: path.createPromotion,
      element: <CreatePromotion />
    },
    {
      path: path.updatePromotion,
      element: <UpdatePromotion />
    },
    {
      path: path.production,
      element: <Production />
    },
    {
      path: path.createProduct,
      element: <CreateProduct />
    },
    {
      path: path.updateProduct,
      element: <UpdateProduct />
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
