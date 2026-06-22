import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product: "",
    quantity: 1,
    customer_name: "",
    customer_email: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("products/");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createOrder = async (event) => {
    event.preventDefault();

    try {
      await api.post("orders/", {
        product: form.product,
        quantity: Number(form.quantity),
        customer_name: form.customer_name,
        customer_email: form.customer_email,
      });
      alert("Order created successfully");
      setForm({ product: "", quantity: 1, customer_name: "", customer_email: "" });
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to create order.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Orders and Tracking</h2>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5>Create Order</h5>
              <form onSubmit={createOrder}>
                <div className="mb-3">
                  <label className="form-label">Product</label>
                  <select
                    className="form-select"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - KES {product.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    min="1"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Customer Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="customer_email"
                    value={form.customer_email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow">
            <div className="card-body">
              <h5>Order History</h5>
              {orders.length === 0 ? (
                <p>No orders found yet.</p>
              ) : (
                <div className="list-group">
                  {orders.map((order) => (
                    <div key={order.id} className="list-group-item mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Order #{order.id}</h6>
                          <p className="mb-1">
                            {order.product_name} x{order.quantity}
                          </p>
                          <p className="mb-1">
                            Customer: {order.customer_name} ({order.customer_email})
                          </p>
                        </div>
                        <span className="badge bg-secondary">{order.status}</span>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">Total: KES {order.total_price}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
