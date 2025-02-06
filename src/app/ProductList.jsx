"use client";

import { useState, useEffect } from "react";

export default function ProductList({
  products,
  isLoadingProduct,
  errorProduct,
  deletingId,
  setDeletingId,
  deleteProduct,
}) {
  if (isLoadingProduct) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }




  if (errorProduct) {
    return (
      <div className="w-full p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        No products found. Add your first product using the form below.
      </div>
    );
  }

  return (
    <div className="pb-20">
      {products?.data?.length > 0 && (
        <div className="mb-6 p-4 text-green-700 bg-green-100 border border-green-300 rounded-lg">
          {products?.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.data?.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={
                  process.env.NEXT_PUBLIC_API_LIVE_URL + product.imageUrl ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="object-cover w-full h-48"
              />
              <button
                onClick={() => deleteProduct(product)}
                disabled={deletingId === product._id}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deletingId === product._id ? "Deleting..." : "Delete"}
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <span className="text-green-600 font-medium">
                  ${product.price?.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Brand: {product.brand}</span>
                <span className="text-gray-500">Stock: {product.stock}</span>
              </div>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
