import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error,setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmt = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setError("");
      const formData = new FormData(e.target);
      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");
      try{
        const res = await apiRequest.post(`/auth/login`,{
        email,
        password
      });
      updateUser(res.data);
      navigate("/")
    }
    catch (error){
      console.log(error);
      setError(error.response.data.message)
      // setError();
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmt}>
          <h1>Welcome back</h1>
          <input name="email" type="email" placeholder="email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">You {"don't"} have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;