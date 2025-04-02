/* eslint-disable no-unused-vars */
import "./AdminLoginPage.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLoginPage() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [showingError, setShowingError] = useState(false)

  useEffect(() => {
    const removeRolesAndTokens = () => {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-role");
    };
    removeRolesAndTokens();
}, []);


  

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "mobile":
        if (!value) return "UID is required";
        return "";
      case "password":
        if (!value) return "Password is required";
        // Ensure at least one character is present
        return "";
      default:
        return "";
    }
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try{
        const LoginResponse = await axios.post(
            "https://think-charge-quiz-app.onrender.com/login/admin",
            {
              uid: formData.mobile,
              password: formData.password,
            }
          );
          if(LoginResponse.status==200){
            await localStorage.setItem("admin-token", LoginResponse.data.token);
            await localStorage.setItem("admin-role", LoginResponse.data.role);
            if(LoginResponse.data.role=="masterAdmin") Navigate('/master-admin')
            if(LoginResponse.data.role=="attendanceAdmin") Navigate('/attendance-admin')
          }else{
            setShowingError(true)
        }
    }catch(err){
        console.log(err)
        setIsSubmitting(false)
        setShowingError(true)
      }
  };

  const handleCancel = () => {
    Navigate("/");
  };

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <>
      <div className="LoginPageContainer">
        <span className="LoginPageHeader">Login As Admin</span>
        <div className="login-container">
          <motion.form
            onSubmit={handleSubmit}
            className="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="form-group">
              <label htmlFor="mobile">UID</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className={errors.mobile ? "error" : ""}
                aria-describedby={errors.mobile && "mobile-error"}
              />
              {errors.mobile && (
                <span id="mobile-error" className="error-message">
                  {errors.mobile}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "error" : ""}
                  aria-describedby={errors.password && "password-error"}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)} // Toggle show/hide password
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="error-message">
                  {errors.password}
                </span>
              )}
            </div>
         

            {showingError&&(<div className="errorBox">
                Wrong Credentials, Try Again!
            </div>)}

            <div className="button-group">
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="secondary-btn"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={!isFormValid || isSubmitting} // Disable button if form is invalid or submitting
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="primary-btn"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </motion.button>
            </div>
          </motion.form>
        </div>
        <button className='AdminLoginButton' onClick={()=> Navigate('/login')}>Participant Login</button>
      </div>
    </>
  );
}
