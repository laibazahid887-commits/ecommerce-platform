import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminProducts.css";
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: "",
  });
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/products?limit=100&search=${encodeURIComponent(search)}`,
      );
      setProducts(response.data.data?.products || []);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSearch = (event) => {
    event.preventDefault();
    fetchProducts();
  };
  const handleEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock ?? 0,
      category_id: product.category_id || "",
      image: product.image || "",
    });
  };
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingProduct((current) => ({ ...current, [name]: value }));
  };
  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((current) => ({ ...current, [name]: value }));
  };
  const handleAddProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.post("/products", {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        category_id: Number(newProduct.category_id),
        image: newProduct.image,
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image: "",
      });
      setShowAddModal(false);
      await fetchProducts();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to add product.");
    } finally {
      setSaving(false);
    }
  };
  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.put(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        category_id: Number(editingProduct.category_id),
        image: editingProduct.image,
      });
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeletingProductId(product.id);
      setError("");
      await api.delete(`/products/${product.id}`);
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item.id !== product.id),
      );
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to delete product.");
    } finally {
      setDeletingProductId(null);
    }
  };
  const closeAddModal = () => {
    if (saving) {
      return;
    }
    setShowAddModal(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image: "",
    });
  };
  return (
    <section className="admin-products-page">
      {" "}
      <div className="admin-products-header">
        {" "}
        <div>
          {" "}
          <span className="admin-products-eyebrow">
            {" "}
            CATALOG MANAGEMENT{" "}
          </span>{" "}
          <h1>Products</h1>{" "}
          <p> Manage watches available in your store. </p>{" "}
        </div>{" "}
        <button
          type="button"
          className="admin-add-product-btn"
          onClick={() => setShowAddModal(true)}
        >
          {" "}
          + Add Product{" "}
        </button>{" "}
      </div>{" "}
      <div className="admin-products-toolbar">
        {" "}
        <form className="admin-product-search" onSubmit={handleSearch}>
          {" "}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />{" "}
          <button type="submit"> Search </button>{" "}
        </form>{" "}
        <span className="admin-product-count">
          {" "}
          {products.length} products{" "}
        </span>{" "}
      </div>{" "}
      {loading && (
        <div className="admin-products-message"> Loading products... </div>
      )}{" "}
      {error && !loading && (
        <div className="admin-products-error"> {error} </div>
      )}{" "}
      {!loading && !error && (
        <div className="admin-products-panel">
          {" "}
          {products.length === 0 ? (
            <div className="admin-products-empty"> No products found. </div>
          ) : (
            <div className="admin-products-table-wrapper">
              {" "}
              <table className="admin-products-table">
                {" "}
                <thead>
                  {" "}
                  <tr>
                    {" "}
                    <th>Product</th> <th>Category</th> <th>Price</th>{" "}
                    <th>Stock</th> <th>Status</th> <th>Actions</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody>
                  {" "}
                  {products.map((product) => (
                    <tr key={product.id}>
                      {" "}
                      <td>
                        {" "}
                        <div className="admin-product-info">
                          {" "}
                          <div className="admin-product-image">
                            {" "}
                            {product.image ? (
                              <img
                                src={`/images/${product.image}`}
                                alt={product.name}
                              />
                            ) : (
                              <span>WATCH</span>
                            )}{" "}
                          </div>{" "}
                          <div>
                            {" "}
                            <strong> {product.name} </strong>{" "}
                            <span> Product #{product.id} </span>{" "}
                          </div>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        {product.category_name ||
                          product.category ||
                          "Uncategorized"}{" "}
                      </td>{" "}
                      <td> PKR {Number(product.price).toLocaleString()} </td>{" "}
                      <td> {product.stock} </td>{" "}
                      <td>
                        {" "}
                        <span
                          className={`admin-product-status ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
                        >
                          {" "}
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-product-actions">
                          {" "}
                          <Link
                            to={`/products/${product.id}`}
                            className="admin-product-view"
                          >
                            {" "}
                            View{" "}
                          </Link>{" "}
                          <button
                            type="button"
                            className="admin-product-edit"
                            onClick={() => handleEdit(product)}
                          >
                            {" "}
                            Edit{" "}
                          </button>{" "}
                          <button
                            type="button"
                            className="admin-product-delete"
                            onClick={() => handleDelete(product)}
                            disabled={deletingProductId === product.id}
                          >
                            {" "}
                            {deletingProductId === product.id
                              ? "Deleting..."
                              : "Delete"}{" "}
                          </button>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
      {showAddModal && (
        <div className="admin-edit-overlay">
          {" "}
          <div className="admin-edit-modal">
            {" "}
            <div className="admin-edit-header">
              {" "}
              <div>
                {" "}
                <span className="admin-products-eyebrow">
                  {" "}
                  CATALOG MANAGEMENT{" "}
                </span>{" "}
                <h2>Add Product</h2>{" "}
              </div>{" "}
              <button
                type="button"
                className="admin-edit-close"
                onClick={closeAddModal}
              >
                {" "}
                ×{" "}
              </button>{" "}
            </div>{" "}
            <form className="admin-edit-form" onSubmit={handleAddProduct}>
              {" "}
              <div className="admin-edit-field">
                {" "}
                <label>Product Name</label>{" "}
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleAddChange}
                  required
                />{" "}
              </div>{" "}
              <div className="admin-edit-field">
                {" "}
                <label>Description</label>{" "}
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleAddChange}
                  rows="4"
                />{" "}
              </div>{" "}
              <div className="admin-edit-row">
                {" "}
                <div className="admin-edit-field">
                  {" "}
                  <label>Price</label>{" "}
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleAddChange}
                    min="0"
                    required
                  />{" "}
                </div>{" "}
                <div className="admin-edit-field">
                  {" "}
                  <label>Stock</label>{" "}
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleAddChange}
                    min="0"
                    required
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="admin-edit-field">
                {" "}
                <label>Category ID</label>{" "}
                <input
                  type="number"
                  name="category_id"
                  value={newProduct.category_id}
                  onChange={handleAddChange}
                  min="1"
                  required
                />{" "}
              </div>{" "}
              <div className="admin-edit-field">
                {" "}
                <label>Image</label>{" "}
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleAddChange}
                  placeholder="watch.jpg"
                />{" "}
              </div>{" "}
              <div className="admin-edit-actions">
                {" "}
                <button
                  type="button"
                  className="admin-edit-cancel"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="admin-edit-save"
                  disabled={saving}
                >
                  {" "}
                  {saving ? "Adding..." : "Add Product"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {editingProduct && (
        <div className="admin-edit-overlay">
          {" "}
          <div className="admin-edit-modal">
            {" "}
            <div className="admin-edit-header">
              {" "}
              <div>
                {" "}
                <span className="admin-products-eyebrow">
                  {" "}
                  PRODUCT MANAGEMENT{" "}
                </span>{" "}
                <h2>Edit Product</h2>{" "}
              </div>{" "}
              <button
                type="button"
                className="admin-edit-close"
                onClick={() => setEditingProduct(null)}
              >
                {" "}
                ×{" "}
              </button>{" "}
            </div>{" "}
            <form className="admin-edit-form" onSubmit={handleUpdateProduct}>
              {" "}
              <div className="admin-edit-field">
                {" "}
                <label>Product Name</label>{" "}
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditChange}
                  required
                />{" "}
              </div>{" "}
              <div className="admin-edit-field">
                {" "}
                <label>Description</label>{" "}
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditChange}
                  rows="4"
                />{" "}
              </div>{" "}
              <div className="admin-edit-row">
                {" "}
                <div className="admin-edit-field">
                  {" "}
                  <label>Price</label>{" "}
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />{" "}
                </div>{" "}
                <div className="admin-edit-field">
                  {" "}
                  <label>Stock</label>{" "}
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="admin-edit-field">
                {" "}
                <label>Category ID</label>{" "}
                <input
                  type="number"
                  name="category_id"
                  value={editingProduct.category_id}
                  onChange={handleEditChange}
                  min="1"
                  required
                />{" "}
              </div>{" "}
              <div className="admin-edit-field">
                {" "}
                <label>Image</label>{" "}
                <input
                  type="text"
                  name="image"
                  value={editingProduct.image}
                  onChange={handleEditChange}
                  placeholder="watch.jpg"
                />{" "}
              </div>{" "}
              <div className="admin-edit-actions">
                {" "}
                <button
                  type="button"
                  className="admin-edit-cancel"
                  onClick={() => setEditingProduct(null)}
                  disabled={saving}
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="admin-edit-save"
                  disabled={saving}
                >
                  {" "}
                  {saving ? "Saving..." : "Save Changes"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </section>
  );
}
export default AdminProducts;
