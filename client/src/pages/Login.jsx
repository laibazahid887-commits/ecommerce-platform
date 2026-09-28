import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
 import axios from "axios"; 
 import { useAuth } from "../context/AuthContext"; function Login() {
     const navigate = useNavigate(); const { login } = useAuth();
      const [formData, setFormData] = useState({ email: "", password: "", });
       const [error, setError] = useState(""); 
       const [loading, setLoading] = useState(false); 
       const handleChange = (event) => { setFormData({ ...formData, [event.target.name]: event.target.value, }); }; 
       const handleSubmit = async (event) => { event.preventDefault(); setError("");
         setLoading(true); 
         try { const response = await axios.post("http://localhost:5000/api/auth/login", formData);
             console.log("Login response:", response.data); 
             const token = response.data.data.token; 
             const user = response.data.data.user; 
             localStorage.setItem("token", token); 
            login(user); 
            setLoading(false); 
           navigate("/"); } 
           catch (error) 
           { console.log(error); 
            setError( error.response?.data?.message || "Login failed. Please check your email and password." ); 
            setLoading(false); } };
             return ( <section className="auth-page"> 
             <div className="auth-card"> 
                <div className="auth-header">
                     <p className="auth-subtitle">WELCOME BACK</p>
                      <h1>Sign In</h1> <p> Access your watch collection and orders. </p>
                       </div> 
                       <form onSubmit={handleSubmit}> 
                        <div className="form-group">
                             <label>Email</label>
                              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required /> 
                              </div>
                              <div className="form-group"> 
                                <label>Password</label>
                                 <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required /> 
                                 </div>
                                  {error && ( <p className="auth-error"> {error} </p> )} 
                                  <button type="submit" className="auth-btn" disabled={loading} >
                                     {loading ? "Signing in..." : "Sign In"}
                                      </button> 
                                      </form> 
                                      <p className="auth-footer"> Don't have an account?{" "}
                                         <Link to="/register">Create an account</Link> 
                                         </p>
                                          </div> 
                                          </section> ); }
 export default Login;