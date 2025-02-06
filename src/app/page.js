"use client";

import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import imageCompression from "browser-image-compression";
export default function CreateItemForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [errorProduct, setErrorProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
      // Create preview URL
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Upload the image
      if (formData.image) {
        const options = {
          maxSizeMB: 0.3, // Max file size in MB
          maxWidthOrHeight: 800, // Max width or height in pixels
          useWebWorker: true, // Use web worker for faster processing
        };

        // Compress image
        const compressedImage = await imageCompression(formData.image, options);

        const imageFormData = new FormData();
        imageFormData.append("image", compressedImage);

        const imageResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const imageData = await imageResponse.json();

        // Step 2: Create item with image URL
        const itemData = {
          ...formData,
          imageUrl: imageData.imageUrl,
          image: undefined, // Remove the file object
        };

        const itemResponse = await fetch("/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });

        if (!itemResponse.ok) {
          throw new Error("Failed to create item");
        }

        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          brand: "",
          stock: "",
          image: null,
        });
        setPreview(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setErrorProduct(error.message);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (product) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeletingId(product._id);
    try {
      // First, delete the image file
      const filename = product.imageUrl.split("/").pop();
      const imageResponse = await fetch(`/api/upload/${filename}`, {
        method: "DELETE",
      });

      if (!imageResponse.ok) {
        throw new Error("Failed to delete image");
      }

      // Then, delete the product from the database
      const productResponse = await fetch(`/api/items/${product._id}`, {
        method: "DELETE",
      });

      if (!productResponse.ok) {
        throw new Error("Failed to delete product");
      }
      fetchProducts();

      // Update the local state to remove the deleted product
      setProducts(products?.data?.filter((p) => p._id !== product._id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Item</h2>

        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block font-medium">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="block font-medium">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block font-medium">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="brand" className="block font-medium">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block font-medium">
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {preview && (
              <div className="mt-2">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Item"}
          </button>
        </form>
      </div>
      <ProductList
        products={products}
        errorProduct={errorProduct}
        isLoadingProduct={isLoadingProduct}
        deletingId={deletingId}
        setDeletingId={setDeletingId}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}
