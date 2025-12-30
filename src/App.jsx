import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Auctions from './pages/Auctions'
import AuctionDetails from './pages/AuctionDetails'
import About from './pages/About'
import Contact from './pages/Contact'

import Register from './pages/Register'
import OTPVerification from './pages/OTPVerification'
import SignIn from './pages/SignIn'
import KYCVerification from './pages/KYCVerification'

import BuyerHeader from './components/BuyerHeader'
import BuyerDashboard from './pages/BuyerDashboard'
import BuyerAuctions from './pages/BuyerAuctions'
import BuyerAuctionDetails from './pages/BuyerAuctionDetails'
import BuyerBids from './pages/BuyerBids'
import BuyerWonItems from './pages/BuyerWonItems'
import BuyerInvoices from './pages/BuyerInvoices'
import BuyerWallet from './pages/BuyerWallet'
import BuyerProfile from './pages/BuyerProfile'

import SellerHeader from './components/SellerHeader'
import SellerDashboard from './pages/SellerDashboard'
import SellerAuctionListings from './pages/SellerAuctionListings'
import SellerListingDetails from './pages/SellerAuctionDetails'
import SellerAuctions from './pages/SellerAuctions'
import SellerCreateProduct from './pages/SellerCreateProduct'
import SellerAnalytics from './pages/SellerAnalytics'
import SellerProfile from './pages/sellerProfile/SellerProfile'
import './App.css'
import Reports from './pages/Reports'

import ManagerHeader from './components/ManagerHeader'
import ManagerDashboard from './pages/ManagerDashboard'
import ManagerInspection from "./pages/ManagerInspection";
import ManagerAuctions from './pages/ManagerAuctions'
import ManagerPublishNew from './pages/ManagerPublishNew'
import ManagerLiveAuctions from './pages/ManagerLiveAuctions'
import ManagerAuctionControlPanel from './pages/ManagerAuctionControlPanel'
import ManagerAuctionResults from './pages/ManagerAuctionResults'
import CategoryManagement from './pages/categoryManagement/CategoryManagement'
import ManagerCreateCategory from './pages/managerCreateCategory/ManagerCreateCategory'
import ManagerProductFields from './pages/managerProductFields/ManagerProductFields'

import AdminHeader from './components/AdminHeader'
import AdminDashboard from './pages/adminDashboard/AdminDashboard'
import AdminFinance from './pages/AdminFinance'
import ManualPaymentEntry from './components/ManualPayment'
import ManualPaymentAuthorization from './pages/ManualPaymentAuthorization'
import PaymentVerification from './pages/paymentVerification/PaymentVerification'
import UserManagement from './pages/userManagement/UserManagement'
import AdminManagerKYC from './pages/userManagement/AdminManagerKYC'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

          {/* ////// Buyer Dashboard Start ////// */}
          <Route path="/buyer/dashboard" element={
            <>
              <BuyerHeader />
              <BuyerDashboard />
            </>
          } />
          <Route path="/buyer/auctions" element={
            <>
              <BuyerHeader />
              <BuyerAuctions />
            </>
          } />
          <Route path="/buyer/auction/:id" element={
            <>
              {/* <BuyerHeader/> */}
            <BuyerAuctionDetails />
            </>
          } />
          <Route path="/buyer/bids" element={
            <>
              <BuyerHeader />
              <BuyerBids />
            </>
          } />
          <Route path="/buyer/won-items" element={
            <>
              <BuyerHeader />
              <BuyerWonItems />
            </>
          } />

          <Route path="/buyer/invoices" element={
            <>
              <BuyerHeader />
              <BuyerInvoices />
            </>
          } />
          {/* <Route path="/buyer/invoice/:invoiceNumber" element={<BuyerInvoices />} /> */}
          <Route path="/buyer/wallet" element={
            <>
              <BuyerHeader />
              <BuyerWallet />
            </>
          } />

          <Route path="/buyer/profile" element={
            <>
              <BuyerHeader />
              <BuyerProfile />
            </>
          } />

          {/* ///// Seller Dashboard Start ////// */}
          <Route path="/seller/dashboard" element={
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
          <Route path='/seller/listing/:id' element={
            <>
              <SellerHeader />
              <SellerListingDetails />
            </>
          }
          />
          <Route path='/seller/auctions' element={
            <>
              <SellerHeader />
              <SellerAuctions />
            </>
          } />
          <Route path='/seller/product' element={
            <>
              <SellerHeader />
              <SellerCreateProduct />
            </>
          } />
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

          {/* /////// Manager Dashboard /////// */}
          <Route path="/manager-panel" element={
            <>
              <ManagerHeader />
              <ManagerDashboard />
            </>
          } />

          <Route path="/manager/inspection" element={
            <>
              <ManagerHeader />
              <ManagerInspection />
            </>
          } />
          <Route path="/manager/reports" element={
            <>
              <ManagerHeader />
              <Reports />
            </>
          } />
          <Route path="/manager/auctions" element={
            <>
              <ManagerHeader />
              <ManagerAuctions />
            </>
          } />

          <Route path="/manager/publishnew" element={
            <>
              <ManagerHeader />
              <ManagerPublishNew />
            </>
          } />
          <Route path="/manager/live-auctions" element={
            <>
              <ManagerHeader />
              <ManagerLiveAuctions />
            </>
          } />
          <Route path="/manager/auction-results" element={
            <>
              <ManagerHeader />
              <ManagerAuctionResults />
            </>
          } />
          <Route path="/manager/controlpanel" element={
            <>
              <ManagerHeader />
              <ManagerAuctionControlPanel />
            </>
          } />

          <Route path="/manager/category" element={
            <>
              <ManagerHeader />
              <CategoryManagement />
            </>
          } />
          <Route path="/manager/add-category" element={
            <>
              <ManagerHeader />
              <ManagerCreateCategory />
            </>
          } />
          <Route path="/manager/product-fields" element={
            <>
              <ManagerHeader />
              <ManagerProductFields />
            </>
          } />
          <Route path="/manager/user-management" element={
            <>
              <ManagerHeader />
              <UserManagement />
            </>
          } />
          <Route path="/manager/kycverification" element={
            <>
              <ManagerHeader />
              <AdminManagerKYC />
            </>
          } />

          {/* /////// Admin Working /////// */}
          <Route path='/admin-panel' element={
            <>
              <AdminHeader />
              <AdminDashboard />
            </>
          } />
          <Route path="/admin/finance" element={
            <>
              <AdminHeader />
              <AdminFinance />
            </>
          } />
          <Route path="/admin/finance/manual-payments" element={
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
