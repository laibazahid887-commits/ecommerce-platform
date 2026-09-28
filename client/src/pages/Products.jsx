import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        let url = "/products";
        if (categoryId) {
          url += `?category=${categoryId}`;
        }
        const response = await api.get(url);
        setProducts(response.data.data.products || []);
        if (categoryId) {
          const categoryResponse = await api.get("/categories");
          const categories = categoryResponse.data.data || [];
          const selectedCategory = categories.find(
            (category) => Number(category.id) === Number(categoryId),
          );
          setCategoryName(selectedCategory?.name || "Category");
        } else {
          setCategoryName("");
        }
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Unable to load watches.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const price = Number(product.price);
      let matchesPrice = true;
      if (priceFilter === "under10000") {
        matchesPrice = price < 10000;
      }
      if (priceFilter === "10000to15000") {
        matchesPrice = price >= 10000 && price <= 15000;
      }
      if (priceFilter === "above15000") {
        matchesPrice = price > 15000;
      }
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === "priceLow") {
        return Number(a.price) - Number(b.price);
      }
      if (sortOption === "priceHigh") {
        return Number(b.price) - Number(a.price);
      }
      if (sortOption === "nameAZ") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  if (loading) {
    return (
      <section className="products-page">
        {" "}
        <div className="products-header">
          {" "}
          <p className="products-subtitle"> OUR COLLECTION </p>{" "}
          <h1>Loading Watches...</h1>{" "}
        </div>{" "}
      </section>
    );
  }
  if (error) {
    return (
      <section className="products-page">
        {" "}
        <div className="products-header">
          {" "}
          <p className="products-subtitle"> OUR COLLECTION </p>{" "}
          <h1>Premium Watches</h1> <p>{error}</p>{" "}
        </div>{" "}
      </section>
    );
  }
  return (
    <section className="products-page">
      {" "}
      <div className="products-header">
        {" "}
        <p className="products-subtitle">
          {" "}
          {categoryName ? "CATEGORY COLLECTION" : "OUR COLLECTION"}{" "}
        </p>{" "}
        <h1> {categoryName || "Premium Watches"} </h1>{" "}
        <p>
          {" "}
          {categoryName
            ? `Explore our ${categoryName.toLowerCase()} collection.`
            : "Explore our collection of watches crafted for timeless style."}{" "}
        </p>{" "}
        <div className="products-toolbar">
          {" "}
          <div className="products-search">
            {" "}
            <input
              type="text"
              placeholder="Search watches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />{" "}
          </div>{" "}
          <div className="products-filter">
            {" "}
            <label htmlFor="priceFilter"> Filter by Price </label>{" "}
            <select
              id="priceFilter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              {" "}
              <option value="all">All Prices</option>{" "}
              <option value="under10000"> Under PKR 10,000 </option>{" "}
              <option value="10000to15000"> PKR 10,000 – 15,000 </option>{" "}
              <option value="above15000"> Above PKR 15,000 </option>{" "}
            </select>{" "}
          </div>{" "}
          <div className="products-sort">
            {" "}
            <label htmlFor="sortProducts"> Sort By </label>{" "}
            <select
              id="sortProducts"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {" "}
              <option value="featured"> Featured </option>{" "}
              <option value="priceLow"> Price: Low to High </option>{" "}
              <option value="priceHigh"> Price: High to Low </option>{" "}
              <option value="nameAZ"> Name: A to Z </option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
        {categoryId && (
          <Link to="/products" className="products-clear-filter">
            {" "}
            ← View All Watches{" "}
          </Link>
        )}{" "}
      </div>{" "}
      {filteredProducts.length === 0 ? (
        <div className="cart-message">
          {" "}
          <p>
            {" "}
            {searchTerm
              ? `No watches found for "${searchTerm}".`
              : categoryName
                ? `No watches available in ${categoryName}.`
                : "No watches available."}{" "}
          </p>{" "}
          {searchTerm && (
            <button
              type="button"
              className="cart-action-btn"
              onClick={() => setSearchTerm("")}
            >
              {" "}
              Clear Search{" "}
            </button>
          )}{" "}
          {categoryId && !searchTerm && (
            <Link to="/products" className="cart-action-btn">
              {" "}
              View All Watches{" "}
            </Link>
          )}{" "}
        </div>
      ) : (
        <div className="products-grid">
          {" "}
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              {" "}
              <div className="product-image">
                {" "}
                {product.image ? (
                  <img src={`/images/${product.image}`} alt={product.name} />
                ) : (
                  <span>WATCH</span>
                )}{" "}
              </div>{" "}
              <div className="product-info">
                {" "}
                <p className="product-category">
                  {" "}
                  {product.category ||
                    categoryName ||
                    "Premium Collection"}{" "}
                </p>{" "}
                <h2>{product.name}</h2>{" "}
                <p className="product-description">
                  {" "}
                  {product.description ||
                    "Premium timepiece with elegant design."}{" "}
                </p>{" "}
                <div className="product-bottom">
                  {" "}
                  <span className="product-price">
                    {" "}
                    PKR {Number(product.price).toLocaleString()}{" "}
                  </span>{" "}
                  <span className="product-stock">
                    {" "}
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}{" "}
                  </span>{" "}
                </div>{" "}
                <Link to={`/products/${product.id}`} className="details-btn">
                  {" "}
                  View Details{" "}
                </Link>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </section>
  );
}
export default Products;
