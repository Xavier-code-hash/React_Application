import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Register(){

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const navigate = useNavigate();

  function handleForm(event){
    event.preventDefault();

    const submit = async () => {
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await api.post("auth/register/", {
          fullName: form.fullName,
          phoneNumber: form.phoneNumber,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });

        alert("Account created successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
        alert("Registration failed");
      }
    }

    submit();

  }

  function handleChange(event){
    const {name, value} = event.target;
    setForm((previousDetails) =>({
      ...previousDetails,
      [name]: value
    }))
  }

  return(
    <>
    <div className="auth-container">
      <div className="auth-card">
        <img src="/src/assets/hero.png" alt="logo" className="auth-logo"/>
        <h2>Create Account</h2>
        <form className="auth-form" onSubmit={handleForm}>
          <input className="form-control" type="text" name="fullName" id="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange}/>

          <input className="form-control" type="tel" name="phoneNumber" id="phoneNumber" placeholder="Phone number" value={form.phoneNumber} onChange={handleChange}/>

          <input className="form-control" type="email" name="email" id="email" placeholder="Email" value={form.email} onChange={handleChange}/>

          <input className="form-control" type="password" name="password" id="password" placeholder="Password" value={form.password} onChange={handleChange}/>

          <input className="form-control" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange}/>

          <div className="auth-actions">
            <button className="btn btn-primary auth-btn" type="submit">Create account</button>
            <button type="button" className="btn btn-link auth-btn" onClick={()=>{window.location.href='/login'}}>Have an account? Log in</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
export default Register