import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    getProducts();

  }, []);

  const getProducts = async () => {

    try {

      const response = await api.get("products/");

      setProducts(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container mt-5">

      <h2 className="mb-4">
        Available Products
      </h2>

      <div className="row">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </div>

  );
}

export default Home;