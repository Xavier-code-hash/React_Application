import { Link } from "react-router-dom";

function Navbar({ user, setUser }) {

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          Product Store
        </Link>

        <div>

          <Link
            className="btn btn-light me-2"
            to="/"
          >
            Home
          </Link>

          <Link
            className="btn btn-warning"
            to="/add-product"
          >
            Add Product
          </Link>

          {user ? (
            <>
              <span className="btn btn-link ms-3" style={{color:'white'}}>Hello, {user.first_name || user.username}</span>
              <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-light ms-2"
                to="/login"
              >
                Log In
              </Link>

              <Link
                className="btn btn-secondary ms-2"
                to="/register"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;

