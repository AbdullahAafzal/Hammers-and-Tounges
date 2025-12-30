import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Auctions from './pages/Auctions'
import About from './pages/About'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import OTPVerification from './pages/OTPVerification'
import KYCVerification from './pages/KYCVerification'
import AuctionDetails from './pages/AuctionDetails'
import Dashboard from './pages/Dashboard'
import SellerDashboard from './pages/SellerDashboard'
import SellerAuctionListings from './pages/SellerAuctionListings'
import CreateProduct from './pages/CreateProduct'
import SellerAnalytics from './pages/SellerAnalytics'
import BuyerAuctions from './pages/BuyerAuctions'
import BuyerAuctionDetails from './pages/BuyerAuctionDetails'
import MyBids from './pages/MyBids'
import WonItems from './pages/WonItems'
import Invoices from './pages/Invoices'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import './App.css'
import SellerAuctions from './pages/SellerAuctions'
import SellerListingDetails from './pages/SellerAuctionDetails'
import AdminPanel from './pages/AdminPanel'
import AdminHeader from "./components/AdminHeader"
import Reports from './pages/Reports'
import InspectionAdmin from "./pages/InspectionAdmin";
import AuctionAdminPanel from './pages/AuctionAdminPanel'
import AdminPublishNew from './pages/AdminPublishNew'
import AuctionControlPanel from './pages/AuctionControlPanel'
import LiveAuctionsTab from './pages/LiveAuctionsTab'
import AdminAuctionResults from './pages/AdminAuctionResults'
import Finance from './pages/Finance'
import ManualPaymentEntry from './components/ManualPayment'
import ManualPaymentAuthorization from './pages/ManualPaymentAuthorization'
import PaymentVerification from './pages/paymentVerification/PaymentVerification'
import CategoryManagement from './pages/categoryManagement/CategoryManagement'
import UserManagement from './pages/userManagement/UserManagement'
import AdminKYC from './pages/userManagement/AdminKYC'
import SellerProfile from './pages/sellerProfile/SellerProfile'
import SellerHeader from './components/SellerHeader'
import CreateCategory from './pages/createCategory/CreateCategory'
import ManageProductFields from './pages/manageProductFields/ManageProductFields'
import BuyerHeader from './components/BuyerHeader'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuperAdminDashboard from './pages/adminDashboard/SuperAdminDashboard'
// import { Provider } from 'react-redux'
// import store from './store/store';


function App() {

  return (
    // <Provider store={store}>
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route path="/otp-verification" element={<OTPVerification />} />


          {/* Guest Flow */}
          <Route path="/" element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/auctions" element={
            <>
              <Header />
              <Auctions />
              <Footer />
            </>
          } />
          <Route path="/auction/:id" element={
            <>
              <Header />
              <AuctionDetails />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          } />
          {/* /////////// Guest Flow End  ////////// */}

          {/* Buyer Dashboard Start */}
          <Route path="/dashboard" element={
            <>
              <BuyerHeader />
              <Dashboard />
            </>
          } />
          <Route path="/buyer/auctions" element={
            <>
              <BuyerHeader />
              <BuyerAuctions />
            </>
          } />
          <Route path="/buyer/auction/:id" element={
            <BuyerAuctionDetails />
          } />
          <Route path="/my-bids" element={
            <>
              <BuyerHeader />
              <MyBids />
            </>
          } />
          <Route path="/won-items" element={
            <>
              <BuyerHeader />
              <WonItems />
            </>
          } />

          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoice/:invoiceNumber" element={<Invoices />} />
          <Route path="/wallet" element={
            <>
              <BuyerHeader />
              <Wallet />
            </>
          } />

          <Route path="/profile" element={
            <>
              <BuyerHeader />
              <Profile />
            </>
          } />
          {/* ///// Buyer Dashboard End ////// */}

          {/* ///// Seller Dashboard Start ////// */}
          <Route path="/seller-dashboard" element={
            <>
              <SellerHeader />
              <SellerDashboard />
            </>
          } />

          <Route path='/seller/auction-listings' element={
            <>
              <SellerHeader />
              <SellerAuctionListings />
            </>
          } />
          <Route path='/seller/create-product' element={
            <>
              <SellerHeader />
              <CreateProduct />
            </>
          } />
          <Route path='/seller/auctions' element={
            <>
              <SellerHeader />
              <SellerAuctions />
            </>
          } />
          <Route path='/seller/listing/:id' element={
            <>
              <SellerHeader />
              <SellerListingDetails />
            </>
          }
          />
          <Route path='/seller/analytics' element={
            <>
              <SellerHeader />

              <SellerAnalytics />
            </>
          } />
          <Route path="/seller/profile" element={
            <>
              <SellerHeader />
              <SellerProfile />
            </>
          } />
          {/* ////////////// Seller Dashboard End ///////////////// */}


          {/* ////////////// Admin Dashboard Start ///////////////// */}
          <Route path="/manager-panel" element={
            <>
              <AdminHeader />
              <AdminPanel />
            </>
          } />
          <Route path="/manager/kycverification" element={
            <>
              <AdminHeader />
              <AdminKYC />
            </>
          } />
          <Route path="/admin/reports" element={
            <>
              <AdminHeader />
              <Reports />
            </>
          } />
          <Route path="/admin/livetab" element={
            <>
              <AdminHeader />
              <LiveAuctionsTab />
            </>
          } />
          <Route path="/admin/finance" element={
            <>
              <AdminHeader />
              <Finance />
            </>
          } />
          <Route path="/finance/manual-payments" element={
            <>
              <AdminHeader />
              <ManualPaymentEntry />
            </>
          } />

          <Route path="/admin/finance/manual/payments-authorization" element={
            <>
              <AdminHeader />
              <ManualPaymentAuthorization />
            </>
          } />
          <Route path="/admin/finance/manual/payments-verification" element={
            <>
              <AdminHeader />
              <PaymentVerification />
            </>
          } />
          <Route path="/admin/auction-results" element={
            <>
              <AdminHeader />
              <AdminAuctionResults />
            </>
          } />
          <Route path="/admin/controlpanel" element={
            <>
              <AdminHeader />
              <AuctionControlPanel />
            </>
          } />
          <Route path="/admin/auctiontab" element={
            <>
              <AdminHeader />
              <AuctionAdminPanel />
            </>
          } />

          <Route path="/admin/publishnew" element={
            <>
              <AdminHeader />
              <AdminPublishNew />
            </>
          } />
          <Route path="/admin/inspection" element={
            <>
              <AdminHeader />
              <InspectionAdmin />
            </>
          } />
          <Route path="/admin/category" element={
            <>
              <AdminHeader />
              <CategoryManagement />
            </>
          } />
          <Route path="/admin/add-category" element={
            <>
              <AdminHeader />
              <CreateCategory />
            </>
          } />
          <Route path="/admin/product-fields" element={
            <>
              <AdminHeader />
              <ManageProductFields />
            </>
          } />
          <Route path="/admin/user-management" element={
            <>
              <AdminHeader />
              <UserManagement />
            </>

          } />
          {/* // ///////////////////////// Admin Dashboard End  /////////////////////////////////////////////////// */}

          {/* //////////////////////  Super Admin Working Start   ///////////////////////////// */}
          <Route path='/super-admin' element={
            <>
              <AdminHeader />
              <SuperAdminDashboard />
            </>
          } />


        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
    // </Provider>
  )
}

export default App
