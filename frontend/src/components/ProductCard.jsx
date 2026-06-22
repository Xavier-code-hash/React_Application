import { Link } from "react-router-dom";
import api from "../services/api";

function ProductCard({ product, onDeleteSuccess }) {

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${product.name}?`);
    
    if (!confirmDelete) return;

    try {
      await api.delete(`products/${product.id}/`);
      alert("Product Deleted Successfully");
      
      if (onDeleteSuccess) {
        onDeleteSuccess(product.id);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow h-100">
        
        {product.image && (
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
            height="250"
            style={{ objectFit: "cover" }}
          />
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text flex-grow-1">{product.description}</p>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="h5 text-success mb-0">
              KES {product.price}
            </span>

            <div>
              <Link
                to={`/edit-product/${product.id}`}
                className="btn btn-outline-primary me-2"
              >
                Edit
              </Link>

              <button 
                onClick={handleDeleteProduct} 
                className="btn btn-outline-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;