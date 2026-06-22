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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-3">

      <div className="container d-flex flex-wrap align-items-center justify-content-between">

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          Product Store
        </Link>

        <div className="d-flex flex-wrap gap-2 align-items-center">

          <Link
            className="btn btn-light"
            to="/"
          >
            Home
          </Link>

          <Link
            className="btn btn-warning me-2"
            to="/add-product"
          >
            Add Product
          </Link>

          <Link
            className="btn btn-success me-2"
            to="/orders"
          >
            Orders
          </Link>

          <Link
            className="btn btn-info me-2"
            to="/expenses"
          >
            Expenses
          </Link>

          <Link
            className="btn btn-secondary"
            to="/dashboard"
          >
            Dashboard
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

