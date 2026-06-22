import { useEffect, useState } from "react";
import api from "../services/api";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "PURCHASE",
    amount: "",
    description: "",
    related_order: "",
  });

  useEffect(() => {
    fetchExpenses();
    fetchOrders();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("expenses/");
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/");
      setOrders(response.data);
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

  const createExpense = async (event) => {
    event.preventDefault();

    try {
      await api.post("expenses/", {
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        related_order: form.related_order || null,
      });
      alert("Expense recorded successfully");
      setForm({ title: "", category: "PURCHASE", amount: "", description: "", related_order: "" });
      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Failed to save expense.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="page-title">Expense Tracker</h2>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card section-card">
            <div className="card-body">
              <h5 className="mb-4">New Expense</h5>
              <form onSubmit={createExpense}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="PURCHASE">Product Purchase</option>
                    <option value="SHIPPING">Shipping</option>
                    <option value="STAFF">Staff</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Related Order (optional)</label>
                  <select
                    className="form-select"
                    name="related_order"
                    value={form.related_order}
                    onChange={handleChange}
                  >
                    <option value="">None</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.id} - {order.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <button className="btn btn-success w-100" type="submit">
                  Record Expense
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card section-card">
            <div className="card-body">
              <h5 className="mb-4">Expense History</h5>
              {expenses.length === 0 ? (
                <p>No expenses recorded yet.</p>
              ) : (
                <div className="list-group">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="list-group-item mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{expense.title}</h6>
                          <p className="mb-1">{expense.category}</p>
                          <p className="mb-1 text-muted">{expense.description}</p>
                          {expense.related_order_id && (
                            <small>Order #{expense.related_order_id}</small>
                          )}
                        </div>
                        <span className="badge bg-danger">KES {expense.amount}</span>
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

export default Expenses;
