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
import OrderMember from './pages/Member/MyAccount/Order/Order'
import MyPond from './pages/Member/MyPond/MyPond'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import VerifySuccess from './pages/VerifyEmail/VerifySuccess'
import { DarkModeProvider } from './hooks/DarkModeContext'
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
import Product from './pages/Shop/Product/Product'
import CreateProduct from './pages/Shop/Product/CreateProduct'
import UpdateProduct from './pages/Shop/Product/UpdateProduct'
import Category from './pages/Shop/Category/Category'
import CreateCategory from './pages/Shop/Category/CreateCategory'
import UpdateCategory from './pages/Shop/Category/UpdateCategory'
import ViewProduct from './pages/Shop/Product/ViewProduct'
import Payment from './pages/Member/Recommendations/Payment'
import ProtectedRoute from './ProtectedRoute'
import PromotionAD from './pages/Admin/Promotion/Promotion'
import Admin from './pages/Admin/Admin'
import ProductImage from './pages/Shop/ProductImage/ProductImage'
import CreateImage from './pages/Shop/ProductImage/CreateImage'
import UpdateImage from './pages/Shop/ProductImage/UpdateImage'
import ViewUser from './pages/Shop/User/ViewUser'
import Pricing from './components/Pricing/Pricing'
import PaymentSuccess from './pages/Member/Recommendations/PaymentSuccess'
import PaymentError from './pages/Member/Recommendations/PaymentError'
import ShopAD from './pages/Admin/ManageUsers/ShopAD'
import CustomerAD from './pages/Admin/ManageUsers/CustomerAD'
import ViewUserAD from './pages/Admin/ManageUsers/ViewUserAD'
import MyPondIssue from './pages/Member/MyPond/MyPondIssue'
import UserDetail from './pages/Shop/User/UserDetail'
import OrderShop from './pages/Shop/Order/Order'
import PaymentShop from './pages/Shop/Payment/Payment'
import DashboardShop from './pages/Shop/Dashboard/Dashboard'
import ProfileShop from './pages/Shop/ShopAccount/ProfileShop'
import UpdateUserAD from './pages/Admin/ManageUsers/UpdateUserAD'
import DashboardAD from './pages/Admin/DashBoard/DashboardAD'
import ManageOrder from './pages/Admin/ManageReport/ManageOrder'
import ProductAD from './pages/Admin/Product/ProductAD'
import SupplierAD from './pages/Admin/Supplier/SupplierAD'
import ViewProductAD from './pages/Admin/Product/ViewProductAD'
import UpdateProductAD from './pages/Admin/Product/UpdateProductAD'
import CreateProductAD from './pages/Admin/Product/CreateProductAD'
import CreateSupplierAD from './pages/Admin/Supplier/CreateSupplierAD'
import UpdateSupplierAD from './pages/Admin/Supplier/UpdateSupplierAD'
import ManagePay from './pages/Admin/ManageReport/ManagePay'
import NewsAD from './pages/Admin/News/NewsAD'
import NewsView from './pages/Admin/News/NewsView'

import ReminderMB from './pages/Member/Reminders/ReminderMB'

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
      element: <Member />
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
      path: path.orderMember,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <OrderMember />
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
      path: path.admin,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Admin />
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
      path: path.paymentSuccess,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <PaymentSuccess />
        </ProtectedRoute>
      )
    },
    {
      path: path.paymentError,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <PaymentError />
        </ProtectedRoute>
      )
    },
    {
      path: path.createTag,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CreateTag />
        </ProtectedRoute>
      )
    },
    {
      path: path.updateTag,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UpdateTag />
        </ProtectedRoute>
      )
    },
    {
      path: path.supplier,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Supplier />
        </ProtectedRoute>
      )
    },
    {
      path: path.createSupplier,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CreateSupplier />
        </ProtectedRoute>
      )
    },
    {
      path: path.updateSupplier,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UpdateSupplier />
        </ProtectedRoute>
      )
    },
    {
      path: path.checkout,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Checkout />
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
      path: path.myPondIssue,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <MyPondIssue />
        </ProtectedRoute>
      )
    },
    {
      path: path.promotion,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Promotion />
        </ProtectedRoute>
      )
    },
    {
      path: path.createPromotion,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CreatePromotion />
        </ProtectedRoute>
      )
    },
    {
      path: path.updatePromotion,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UpdatePromotion />
        </ProtectedRoute>
      )
    },
    {
      path: path.product,
      element: <Product />
    },
    {
      path: path.createProduct,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CreateProduct />
        </ProtectedRoute>
      )
    },
    {
      path: path.updateProduct,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <UpdateProduct />
        </ProtectedRoute>
      )
    },
    {
      path: path.category,
      element: <Category />
    },
    {
      path: path.createCategory,
      element: <CreateCategory />
    },
    {
      path: path.updateCategory,
      element: <UpdateCategory />
    },
    {
      path: path.viewProduct,
      element: <ViewProduct />
    },
    {
      path: path.promotionAD,
      element: <PromotionAD />
    },
    {
      path: path.productImage,
      element: <ProductImage />
    },
    {
      path: path.createImage,
      element: <CreateImage />
    },
    {
      path: path.updateImage,
      element: <UpdateImage />
    },
    {
      path: path.viewUser,
      element: <ViewUser />
    },
    {
      path: path.userDetail,
      element: <UserDetail />
    },
    {
      path: path.pricing,
      element: <Pricing />
    },
    {
      path: path.shopAD,
      element: <ShopAD />
    },
    {
      path: path.customerAD,
      element: <CustomerAD />
    },
    {
      path: path.viewUserAD,
      element: <ViewUserAD />
    },
    {
      path: path.orderShop,
      element: <OrderShop />
    },
    {
      path: path.paymentShop,
      element: <PaymentShop />
    },
    {
      path: path.dashboardShop,
      element: <DashboardShop />
    },
    {
      path: path.profileShop,
      element: <ProfileShop />
    },
    {
      path: path.updateUserAD,
      element: <UpdateUserAD />
    },
    {
      path: path.manageOrder,
      element: <ManageOrder />
    },
    {
      path: path.productAD,
      element: <ProductAD />
    },
    {
      path: path.supplierAD,
      element: <SupplierAD />
    },
    {
      path: path.dashboardAD,
      element: <DashboardAD />
    },
    {
      path: path.viewProductAD,
      element: <ViewProductAD />
    },
    {
      path: path.updateProductAD,
      element: <UpdateProductAD />
    },
    {
      path: path.createProductAD,
      element: <CreateProductAD />
    },
    {
      path: path.createSupplierAD,
      element: <CreateSupplierAD />
    },
    {
      path: path.updateSupplierAD,
      element: <UpdateSupplierAD />
    },
    {
      path: path.managePay,
      element: <ManagePay />
    },
    {
      path: path.newsAD,
      element: <NewsAD />
    },
    {
      path: path.newsView,
      element: <NewsView />
    }
  ])

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
