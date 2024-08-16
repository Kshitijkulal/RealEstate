import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import OtpInput from "otp-input-react";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [OTP, setOTP] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const sendMail = async () => {
    try {
      const formData = new FormData(document.querySelector('form'));
      const email = formData.get("email");
      const username = formData.get("username");
      const otp = await apiRequest.post(`/auth/send-otp`, { email, username });
      if(otp) setOTP(true);
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP");
    }
  };


    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("")
      setIsLoading(true);
      const formData = new FormData(e.target);
  
      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");
      const otp = formData.get("otp");
  
      try {
        const res = await apiRequest.post("/auth/register", {
          username,
          email,
          password,
          otp
        });
        navigate("/login");
      } catch (err) {
        setError(err.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="button" disabled={isLoading} onClick={sendMail}>
            {isOTPSent ? "OTP Sent" : "Send OTP"}
          </button>
          {OTP && (
            <>
              <p>Enter OTP</p>
              <input name= "otp" type = "text" placeholder="OTP" />
            </>
          )}
          <button type="submit" disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
