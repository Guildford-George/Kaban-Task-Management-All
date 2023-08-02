import {useState} from "react"
import { NavLink, Navigate } from "react-router-dom";
import { initialLoginStateValue } from "../utils/GeneralUtils";
import useLogin from "../hooks/useLogin";
const Login = () => {
  const [signIn, setSignIn] = useState(initialLoginStateValue)
  const [signInError, setSignInError] = useState(initialLoginStateValue)

  const {isLoading,setIsLoading,submit,setSubmit}= useLogin(signIn, setSignInError,initialLoginStateValue)
  
  const handleSubmit= (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setSubmit(true)
  }

  const handleChange= (e:React.ChangeEvent<HTMLInputElement>)=>{
    const name=e.target.name as "email" |"password"
    const value=e.target.value
    setSignIn((prev)=>{
      return {...prev, [name]:value}
    })
  }
  
  return (
    <section className="auth">
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Welocome</h1>
          <div className="nav-brand">
            <img src="" alt="" />
          </div>
          <p className="mes">Sign in by entering the information below</p>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={handleChange} value={signIn.email}/>
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={handleChange} value={signIn.password}/>
          </div>
          <button className="form-btn primary-btn">Sign In</button>
          <p>Don't have an account</p>
          <div className="navlink-center">
            <NavLink to="/register">Sign Up</NavLink>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
