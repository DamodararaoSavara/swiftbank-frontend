import { useRef, useState } from "react";
import "./BankRegistrationForm.css";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function BankRegistrationForm() {
  //   const firstNameRef = useRef(null);
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    idType: "",
    idNumber: "",
    occupation: "",
    annualIncome: "",
    accountType: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    idType: "",
    idNumber: "",
    occupation: "",
    annualIncome: "",
    accountType: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const focusField = (ref) => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.focus(); // Focus the field
      }
    }, 300);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- FRONTEND VALIDATION START ---
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{8,}$/;

    if (!formData.firstName.trim())
      return toast.error("First name is required");
    if (!formData.lastName.trim()) return toast.error("Last name is required");

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email format");
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      return toast.error("Phone must be 10 digits");
    }
    if (!formData.occupation) return toast.error("Select the occupation ");
    if (!formData.annualIncome) return toast.error("Select the annualIncome ");
    if (!formData.accountType) return toast.error("Select the account type ");
    if (!formData.dob) return toast.error("Date of Birth is required");
    if (!formData.idType) return toast.error("Select the Id type ");
    if (!formData.idNumber)
      return toast.error("Appropriate id should be required ");
    if (!formData.gender) return toast.error("Gender is required");
    if (!formData.password) return toast.error("Password should not be empty");
    if (!formData.confirmPassword)
      return toast.error("Confirm Password should not be empty");
    if (!strongPasswordRegex.test(formData.password)) {
      return toast.error(
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters"
      );
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Password does not match");
    }
    // --- FRONTEND VALIDATION END ---
    if (loading) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        annualIncome: Number(formData.annualIncome),
      };
      const response = await api.post("/account", payload);
      toast.success("OTP sent to email");
      setFormData(initialFormData);
      navigate("/verify-otp");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
      const newErrors = {};
      if (message.includes("Email")) {
        newErrors.email = "Email already exists";
        focusField(emailRef);
      }
      if (message.includes("Password does not match")) {
        newErrors.confirmPassword = "Passwords do not match";
        focusField(confirmPasswordRef);
      }
      setErrors(newErrors);
      if (message.includes("Invalid") || message.includes("required")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-bg">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="registration-title">Bank Registration Form</h2>

        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="input-field"
        />

        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="input-field"
        />

        <input
          name="email"
          type="email"
          ref={emailRef}
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={`input-field ${errors.email ? "input-error" : ""}`}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          name="phone"
          type="tel"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="input-field"
        />

        <input
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          className="input-field"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="input-field full-row"
        />

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="input-field"
        />

        <input
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="input-field"
        />

        <input
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="input-field"
        />

        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="input-field"
        />

        <select
          name="idType"
          value={formData.idType}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select ID Type</option>
          <option value="Aadhar">Aadhar</option>
          <option value="PAN">PAN</option>
          <option value="Passport">Passport</option>
          <option value="Driving License">Driving License</option>
          <option value="Voter ID">Voter ID</option>
        </select>

        <input
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          placeholder="ID Number"
          className="input-field"
        />

        <select
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Occupation</option>
          <option value="Salaried">Salaried</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Student">Student</option>
          <option value="Retired">Retired</option>
          <option value="Unemployed">Unemployed</option>
        </select>

        <select
          name="annualIncome"
          value={formData.annualIncome}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Annual Income</option>
          <option value="250000">Below ₹2.5 Lakh</option>
          <option value="500000">₹2.5 – ₹5 Lakh</option>
          <option value="1000000">₹5 – ₹10 Lakh</option>
          <option value="1500000">₹10 – ₹15 Lakh</option>
          <option value="2000000">Above ₹15 Lakh</option>
        </select>

        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Account Type</option>
          <option value="SAVINGS">Savings Account</option>
          <option value="CURRENT">Current Account</option>
          <option value="SALARY">Salary Account</option>
          <option value="NRI">NRI Account</option>
        </select>

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="input-field"
        />

        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="input-field"
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="register-link">
          Already have an account? then login here
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </form>
    </div>
  );
}
