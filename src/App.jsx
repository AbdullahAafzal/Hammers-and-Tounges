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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InspectionAdmin from "./pages/InspectionAdmin";
import AuctionAdminPanel from './pages/AuctionAdminPanel'
import AdminPublishNew from './pages/AdminPublishNew'
import AuctionControlPanel from './pages/AuctionControlPanel'
import LiveAuctionsTab from './pages/LiveAuctionsTab'
import AdminAuctionResults from './pages/AdminAuctionResults'
import Finance from './pages/Finance'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path='/seller/auction-listings' element={<SellerAuctionListings />}/>
          <Route path='/seller/create-product' element={<CreateProduct/>}/>
          <Route path='/seller/auctions' element={<SellerAuctions/>}/>
          <Route path='/seller/listing/:id' element={<SellerListingDetails/>}/>
          <Route path='/seller/analytics' element={<SellerAnalytics/>}/>
          <Route path="/buyer/auctions" element={<BuyerAuctions />} />
          <Route path="/buyer/auction/:id" element={<BuyerAuctionDetails />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/won-items" element={<WonItems />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoice/:invoiceNumber" element={<Invoices />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="/reports" element={
            <>
              <AdminHeader />
              <Reports/>
            </>
          } />
           <Route path="/livetab" element={
            <>
              <AdminHeader />
              <LiveAuctionsTab/>
            </>
            
          } />
           <Route path="/finance" element={
            <>
              <AdminHeader />
              <Finance/>
            </>
            
          } />
           <Route path="/AdminAuctionResults" element={
            <>
              <AdminHeader />
              <AdminAuctionResults/>
            </>
            
          } />
           <Route path="/controlpanel" element={
            <>
              <AdminHeader />
              <AuctionControlPanel/>
            </>
          } />
           <Route path="/auctiontab" element={
            <>
              <AdminHeader />
              <AuctionAdminPanel/>
            </>
          } />

          <Route path="/admin-panel" element={
            <>
              <AdminHeader />
              <AdminPanel />
            </>
          } />
 <Route path="/publishnew" element={
            <>
              <AdminHeader />
              <AdminPublishNew />
            </>
          } />
          <Route path="/inspection" element={
            <>
            <AdminHeader/>
              <InspectionAdmin />
            </>
          } />

          <Route path="/auction/:id" element={
            <>
              <Header />
              <AuctionDetails />
              <Footer />
            </>
          } />
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
        </Routes>
        <ToastContainer /> 
      </div>
    </Router>
  )
}

export default App
