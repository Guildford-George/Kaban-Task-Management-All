import { NavLink } from "react-router-dom";

const Register = () => {
  return (
    <section className="auth">
      <div>
        <form action="">
          <h1>Welocome</h1>
          <div className="nav-brand">
            <img src="" alt="" />
          </div>
          <p className="mes">Sign up by entering the information below</p>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
          </div>
          <div className="form-field">
            <label htmlFor="firstname">Firstname</label>
            <input type="text" name="firstname" id="firstname" />
          </div>
          <div className="form-field">
            <label htmlFor="lastname">Lastname</label>
            <input type="email" name="lastname" id="lastname" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
          <div className="form-field">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              id="confirmpassword"
            />
          </div>
          <button className="form-btn primary-btn">Sign Up</button>
          <p>Already have an account</p>
          <div className="navlink-center">
            <NavLink to="/login">Sign In</NavLink>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
