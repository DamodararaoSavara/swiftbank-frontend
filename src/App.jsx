import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routes/PrivateRoute";
import CreateAccount from "./components/CreateAccount";
import AccountDetails from "./components/account/AccountDetails";
import BankRegistrationForm from "./components/auth/BankRegistrationForm";
import Services from "./components/banking/Services";
import Deposit from "./components/banking/Deposit";
import Withdraw from "./components/banking/Withdraw";
import Transfer from "./components/banking/Transfer";
import TransactionHistory from "./components/banking/TransactionHistory";
import ForgotPassword from "./components/auth/ForgotPassword";
import ForgotVerifyOtp from "./components/auth/ForgotVerifyOtp";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import ProtectedLayout from "./layouts/ProtectedLayout";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          {/* 🔓 PUBLIC ROUTES (NO NAVBAR) */}
          <Route path="/login" element={<Login />} />
          <Route path="/bank-registration" element={<BankRegistrationForm />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-verify-otp" element={<ForgotVerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* 🔐 PROTECTED ROUTES (WITH NAVBAR) */}
          {/* 🔐 PROTECTED ROUTES (WITH NAVBAR) */}
          {/* 🔐 PROTECTED ROUTES (WITH NAVBAR) */}
          <Route
            element={
              <PrivateRoute>
                <ProtectedLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/create-account" element={<CreateAccount />} /> */}
            <Route path="/services" element={<Services />} />

            <Route path="/account/:accountId" element={<AccountDetails />} />
            <Route path="/account/:accountId/deposit" element={<Deposit />} />
            <Route path="/account/:accountId/withdraw" element={<Withdraw />} />
            <Route path="/account/:accountId/transfer" element={<Transfer />} />
            <Route
              path="/account/:accountId/transactions"
              element={<TransactionHistory />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
