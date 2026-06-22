import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddProduct() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null
  })



  function handleData(event) {
    const { name, value, files, type } = event.target;
    setForm((previewDetails) => ({
      ...previewDetails,
      [name]: type === "file" ? files[0] : value,
    }))
  }

  const saveProduct = async (event) => {

    event.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("image", form.image);



    try {

      await api.post(
        "products/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product Added Successfully");

      navigate("/");

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container mt-5">

      <div className="card shadow">

        <div className="card-body">

          <h2>Add Product</h2>

          <form onSubmit={saveProduct}>

            <input
              type="text"
              name="name"
              className="form-control mb-3"
              placeholder="Product Name"
              value={form.name}
              onChange={handleData}
            
            />

            <input
              type="number"
              name="price"
              className="form-control mb-3"
              placeholder="Price"
              value={form.price}
              onChange={handleData}
            
            />

            <textarea
              className="form-control mb-3"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleData}
            
            />

            <input
              type="file"
              name="image"
              className="form-control mb-3"
              onChange={handleData}
          
            />

            <button
              className="btn btn-primary w-100"
            >
              Save Product
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}






export default AddProduct;
