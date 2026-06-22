import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function LogIn(){
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate();

  function handleForm(event){
    event.preventDefault();
    const submit = async () => {
      try {
        const response = await api.post("auth/login/", {
          email: form.email,
          password: form.password,
        });

        alert("Logged in successfully");
        navigate("/");
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.detail || "Login failed");
      }
    }

    submit();
  }

  function updateChanges(event){
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
        <h2>Log In</h2>
        <form className="auth-form" onSubmit={handleForm}>
          <input className="form-control" type="email" name="email" id="email" placeholder="Email" value={form.email} onChange={updateChanges}/>
          <input className="form-control" type="password" name="password" id="password" placeholder="Password" value={form.password} onChange={updateChanges}/>

          <div className="auth-actions">
            <button className="btn btn-primary auth-btn" type="submit">Log In</button>
            <button type="button" className="btn btn-link auth-btn" onClick={()=>{window.location.href='/register'}}>Create account</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default LogIn