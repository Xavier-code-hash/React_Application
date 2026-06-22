import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("dashboard/");
        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="container mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="page-title">Business Dashboard</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Total Products</h6>
            <p className="fs-3 mb-0">{stats.total_products}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Total Orders</h6>
            <p className="fs-3 mb-0">{stats.total_orders}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Total Revenue</h6>
            <p className="fs-3 mb-0">KES {stats.total_revenue}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Total Expenses</h6>
            <p className="fs-3 mb-0">KES {stats.total_expenses}</p>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h6>Order Status Breakdown</h6>
            <div className="d-flex justify-content-between">
              <span>Pending</span>
              <strong>{stats.pending_orders}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Confirmed</span>
              <strong>{stats.confirmed_orders}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipped</span>
              <strong>{stats.shipped_orders}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Delivered</span>
              <strong>{stats.delivered_orders}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
