import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {

        try {

            const response = await api.get(`products/${id}/`);

            setName(response.data.name);
            setPrice(response.data.price);
            setDescription(response.data.description);
            setCurrentImage(response.data.image);

        } catch (error) {

            console.log("Error fetching product:", error);

        }
    };

    const updateProduct = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);

        if (image) {
            formData.append("image", image);
        }

        try {

            await api.put(
                `products/${id}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Product Updated Successfully");

            navigate("/");

        } catch (error) {

            console.log("Update Error:", error);

        }
    };

    return (
        <div className="container mt-5">

            <div className="card shadow">

                <div className="card-body">

                    <h2 className="mb-4">
                        Edit Product
                    </h2>

                    <form onSubmit={updateProduct}>

                        <div className="mb-3">
                            <label className="form-label">
                                Product Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Price
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />
                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Current Image
                            </label>

                            <br />

                            {currentImage && (
                                <img
                                    src={currentImage}
                                    alt="Product"
                                    width="150"
                                    className="img-thumbnail mb-3"
                                />
                            )}

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                New Image
                            </label>

                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) =>
                                    setImage(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </div>

                        <button
                            className="btn btn-success w-100"
                        >
                            Update Product
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default EditProduct;