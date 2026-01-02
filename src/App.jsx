import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import AuctionDetails from "./pages/AuctionDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import OTPVerification from "./pages/OTPVerification";
import KYCVerification from "./pages/KYCVerification";

import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerAuctions from "./pages/BuyerAuctions";
import BuyerAuctionDetails from "./pages/BuyerAuctionDetails";
import BuyerBids from "./pages/BuyerBids";
import BuyerWonItems from "./pages/BuyerWonItems";
import BuyerInvoices from "./pages/BuyerInvoices";
import BuyerWallet from "./pages/BuyerWallet";
import BuyerProfile from "./pages/BuyerProfile";

import SellerDashboard from "./pages/SellerDashboard";
import SellerAuctionListings from "./pages/SellerAuctionListings";
import SellerListingDetails from "./pages/SellerAuctionDetails";
import SellerAuctions from "./pages/SellerAuctions";
import SellerCreateProduct from "./pages/SellerCreateProduct";
import SellerAnalytics from "./pages/SellerAnalytics";
import SellerProfile from "./pages/sellerProfile/SellerProfile";

// Manager
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerInspection from "./pages/ManagerInspection";
import ManagerAuctions from './pages/ManagerAuctions'
import ManagerPublishNew from './pages/ManagerPublishNew'
import ManagerLiveAuctions from './pages/ManagerLiveAuctions'
import ManagerAuctionControlPanel from './pages/ManagerAuctionControlPanel'
import ManagerAuctionResults from './pages/ManagerAuctionResults'
import CategoryManagement from './pages/categoryManagement/CategoryManagement'
import ManagerCreateCategory from './pages/managerCreateCategory/ManagerCreateCategory'
import ManagerProductFields from './pages/managerProductFields/ManagerProductFields'

// Admin
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AdminProfile from "./pages/adminProfile/AdminProfile";
import AdminFinance from './pages/AdminFinance'
import ManualPaymentEntry from './components/ManualPayment'
import ManualPaymentAuthorization from './pages/ManualPaymentAuthorization'
import PaymentVerification from './pages/paymentVerification/PaymentVerification'
import UserManagement from './pages/userManagement/UserManagement'
import AdminManagerKYC from './pages/userManagement/AdminManagerKYC'

// Route Guards
import BuyerGuard from "./guards/BuyerGuard";
import SellerGuard from "./guards/SellerGuard";
import ManagerGuard from "./guards/ManagerGuard";
import AdminGuard from "./guards/AdminGuard";

// All Role's Layouts
import BuyerLayout from "./layouts/BuyerLayout";
import SellerLayout from "./layouts/SellerLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import AdminLayout from "./layouts/AdminLayout";
import { Provider } from "react-redux";
import store from './store/store'

import { Bounce, ToastContainer } from "react-toastify";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/auctions" element={<><Header /><Auctions /><Footer /></>} />
            <Route path="/auction/:id" element={<><Header /><AuctionDetails /><Footer /></>} />
            <Route path="/about" element={<><Header /><About /><Footer /></>} />
            <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/kyc-verification" element={<KYCVerification />} />

            {/* Buyer Routes */}
            <Route element={<BuyerGuard />}>
              <Route element={<BuyerLayout />}>
                <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                <Route path="/buyer/auctions" element={<BuyerAuctions />} />
                <Route path="/buyer/auction/:id" element={<BuyerAuctionDetails />} />
                <Route path="/buyer/bids" element={<BuyerBids />} />
                <Route path="/buyer/won-items" element={<BuyerWonItems />} />
                <Route path="/buyer/invoices" element={<BuyerInvoices />} />
                <Route path="/buyer/wallet" element={<BuyerWallet />} />
                <Route path="/buyer/profile" element={<BuyerProfile />} />
              </Route>
            </Route>

            {/* Seller Routes */}
            <Route element={<SellerGuard />}>
              <Route element={<SellerLayout />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/auction-listings" element={<SellerAuctionListings />} />
                <Route path="/seller/listing/:id" element={<SellerListingDetails />} />
                <Route path="/seller/auctions" element={<SellerAuctions />} />
                <Route path="/seller/product" element={<SellerCreateProduct />} />
                <Route path="/seller/analytics" element={<SellerAnalytics />} />
                <Route path="/seller/profile" element={<SellerProfile />} />
              </Route>
            </Route>

            {/* Manager Routes */}
            <Route element={<ManagerGuard />}>
              <Route element={<ManagerLayout />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/profile" element={<ManagerProfile />} />
                <Route path="/manager/inspection" element={
                  <>
                    <ManagerInspection />
                  </>
                } />

                <Route path="/manager/auctions" element={
                  <>
                    <ManagerAuctions />
                  </>
                } />

                <Route path="/manager/publishnew" element={
                  <>
                    <ManagerPublishNew />
                  </>
                } />
                <Route path="/manager/live-auctions" element={
                  <>
                    <ManagerLiveAuctions />
                  </>
                } />
                <Route path="/manager/auction-results" element={
                  <>
                    <ManagerAuctionResults />
                  </>
                } />
                <Route path="/manager/controlpanel" element={
                  <>
                    <ManagerAuctionControlPanel />
                  </>
                } />

                <Route path="/manager/category" element={
                  <>
                    <CategoryManagement />
                  </>
                } />
                <Route path="/manager/add-category" element={
                  <>
                    <ManagerCreateCategory />
                  </>
                } />
                <Route path="/manager/product-fields" element={
                  <>
                    <ManagerProductFields />
                  </>
                } />

              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/finance/manual-payments" element={
                  <>
                    <ManualPaymentEntry />
                  </>
                } />

                <Route path="/admin/finance/manual/payments-authorization" element={
                  <>
                    <ManualPaymentAuthorization />
                  </>
                } />
                <Route path="/admin/finance/manual/payments-verification" element={
                  <>
                    <PaymentVerification />
                  </>
                } />
                <Route path="/admin/users" element={
                  <>
                    <UserManagement />
                  </>
                } />
                <Route path="/admin/kycverification/:id" element={
                  <>
                    <AdminManagerKYC />
                  </>
                } />

              </Route>
            </Route>

          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
