import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminCategories.css";
function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNewCategory((current) => ({ ...current, [name]: value }));
  };
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingCategory((current) => ({ ...current, [name]: value }));
  };
  const handleAddCategory = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.post("/categories", {
        name: newCategory.name,
        description: newCategory.description,
      });
      setNewCategory({ name: "", description: "" });
      setShowAddModal(false);
      await fetchCategories();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to add category.");
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = (category) => {
    setEditingCategory({
      id: category.id,
      name: category.name || "",
      description: category.description || "",
    });
  };
  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.put(`/categories/${editingCategory.id}`, {
        name: editingCategory.name,
        description: editingCategory.description,
      });
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to update category.");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeletingCategoryId(category.id);
      setError("");
      await api.delete(`/categories/${category.id}`);
      setCategories((currentCategories) =>
        currentCategories.filter((item) => item.id !== category.id),
      );
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to delete category.");
    } finally {
      setDeletingCategoryId(null);
    }
  };
  const closeAddModal = () => {
    if (saving) {
      return;
    }
    setShowAddModal(false);
    setNewCategory({ name: "", description: "" });
  };
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="admin-categories-page">
      {" "}
      <div className="admin-categories-header">
        {" "}
        <div>
          {" "}
          <span className="admin-categories-eyebrow">
            {" "}
            CATALOG MANAGEMENT{" "}
          </span>{" "}
          <h1>Categories</h1>{" "}
          <p> Manage product categories in your store. </p>{" "}
        </div>{" "}
        <button
          type="button"
          className="admin-add-category-btn"
          onClick={() => setShowAddModal(true)}
        >
          {" "}
          + Add Category{" "}
        </button>{" "}
      </div>{" "}
      <div className="admin-categories-toolbar">
        {" "}
        <div className="admin-category-search">
          {" "}
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />{" "}
        </div>{" "}
        <span className="admin-category-count">
          {" "}
          {filteredCategories.length} categories{" "}
        </span>{" "}
      </div>{" "}
      {loading && (
        <div className="admin-categories-message"> Loading categories... </div>
      )}{" "}
      {error && !loading && (
        <div className="admin-categories-error"> {error} </div>
      )}{" "}
      {!loading && (
        <div className="admin-categories-panel">
          {" "}
          {filteredCategories.length === 0 ? (
            <div className="admin-categories-empty"> No categories found. </div>
          ) : (
            <div className="admin-categories-table-wrapper">
              {" "}
              <table className="admin-categories-table">
                {" "}
                <thead>
                  {" "}
                  <tr>
                    {" "}
                    <th>ID</th> <th>Category</th> <th>Description</th>{" "}
                    <th>Actions</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody>
                  {" "}
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      {" "}
                      <td>
                        {" "}
                        <span className="admin-category-id">
                          {" "}
                          #{category.id}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-category-name">
                          {" "}
                          {category.name}{" "}
                        </div>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-category-description">
                          {" "}
                          {category.description || "No description"}{" "}
                        </div>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-category-actions">
                          {" "}
                          <button
                            type="button"
                            className="admin-category-edit"
                            onClick={() => handleEdit(category)}
                          >
                            {" "}
                            Edit{" "}
                          </button>{" "}
                          <button
                            type="button"
                            className="admin-category-delete"
                            onClick={() => handleDelete(category)}
                            disabled={deletingCategoryId === category.id}
                          >
                            {" "}
                            {deletingCategoryId === category.id
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
        <div className="admin-category-overlay">
          {" "}
          <div className="admin-category-modal">
            {" "}
            <div className="admin-category-modal-header">
              {" "}
              <div>
                {" "}
                <span className="admin-categories-eyebrow">
                  {" "}
                  CATALOG MANAGEMENT{" "}
                </span>{" "}
                <h2>Add Category</h2>{" "}
              </div>{" "}
              <button
                type="button"
                className="admin-category-close"
                onClick={closeAddModal}
              >
                {" "}
                ×{" "}
              </button>{" "}
            </div>{" "}
            <form className="admin-category-form" onSubmit={handleAddCategory}>
              {" "}
              <div className="admin-category-field">
                {" "}
                <label>Category Name</label>{" "}
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleAddChange}
                  placeholder="e.g. Luxury Watches"
                  required
                />{" "}
              </div>{" "}
              <div className="admin-category-field">
                {" "}
                <label>Description</label>{" "}
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleAddChange}
                  placeholder="Enter category description"
                  rows="5"
                />{" "}
              </div>{" "}
              <div className="admin-category-form-actions">
                {" "}
                <button
                  type="button"
                  className="admin-category-cancel"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="admin-category-save"
                  disabled={saving}
                >
                  {" "}
                  {saving ? "Adding..." : "Add Category"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}{" "}
      {editingCategory && (
        <div className="admin-category-overlay">
          {" "}
          <div className="admin-category-modal">
            {" "}
            <div className="admin-category-modal-header">
              {" "}
              <div>
                {" "}
                <span className="admin-categories-eyebrow">
                  {" "}
                  CATEGORY MANAGEMENT{" "}
                </span>{" "}
                <h2>Edit Category</h2>{" "}
              </div>{" "}
              <button
                type="button"
                className="admin-category-close"
                onClick={() => setEditingCategory(null)}
              >
                {" "}
                ×{" "}
              </button>{" "}
            </div>{" "}
            <form
              className="admin-category-form"
              onSubmit={handleUpdateCategory}
            >
              {" "}
              <div className="admin-category-field">
                {" "}
                <label>Category Name</label>{" "}
                <input
                  type="text"
                  name="name"
                  value={editingCategory.name}
                  onChange={handleEditChange}
                  required
                />{" "}
              </div>{" "}
              <div className="admin-category-field">
                {" "}
                <label>Description</label>{" "}
                <textarea
                  name="description"
                  value={editingCategory.description}
                  onChange={handleEditChange}
                  rows="5"
                />{" "}
              </div>{" "}
              <div className="admin-category-form-actions">
                {" "}
                <button
                  type="button"
                  className="admin-category-cancel"
                  onClick={() => setEditingCategory(null)}
                  disabled={saving}
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="admin-category-save"
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
export default AdminCategories;
