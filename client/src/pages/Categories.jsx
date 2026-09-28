import { useEffect, useState } from "react";
 import { Link } from "react-router-dom"; 
 import api from "../services/api"; 
 function Categories() {
   const [categories, setCategories] = useState([]); const [loading, setLoading] = useState(true); 
   const [error, setError] = useState("");
    useEffect(() => { const fetchCategories = async () => { try { const response = await api.get("/categories"); const allCategories = response.data.data || [];
      const watchCategories = allCategories.filter((category) => { const categoryName = (category.name || "").toLowerCase();
         return ( categoryName.includes("watch") || categoryName.includes("smart") ); }); 
         setCategories(watchCategories);
         } catch (error) { console.log(error); 
          setError( error.response?.data?.message || "Unable to load categories." ); 
        } finally { setLoading(false); } }; fetchCategories(); }, []); 
        if (loading) { return ( <main className="categories-page"> 
        <div className="categories-header"> 
          <p className="categories-subtitle"> EXPLORE OUR COLLECTION </p> 
          <h1>Shop by Category</h1> 
          <p> Discover timepieces selected for different styles, occasions, and personalities. </p>
           </div> <div className="categories-message"> <p>Loading categories...</p> </div> </main> ); 
          } if (error) { return ( <main className="categories-page"> <div className="categories-header">
            <p className="categories-subtitle"> EXPLORE OUR COLLECTION </p> <h1>Shop by Category</h1>
             </div> <div className="categories-message categories-error"> <p>{error}</p> 
             </div> </main> ); } return ( <main className="categories-page"> 
              <div className="categories-header">
                 <p className="categories-subtitle"> EXPLORE OUR COLLECTION </p> 
                 <h1>Shop by Category</h1>
                  <p> Discover timepieces selected for different styles, occasions, and personalities. </p>
                   </div> {categories.length === 0 ? ( <div className="categories-message"
                   > <p>No watch categories available.</p> </div> ) : ( <div className="categories-grid">
                    {categories.map((category, index) => ( <div className="category-page-card" key={category.id} > <div className="category-page-number"> {String(index + 1).padStart(2, "0")} </div>
                     <div className="category-page-content"> 
                      <h2>{category.name}</h2>
                       <p> {category.description || "Explore our carefully selected timepieces."} </p> 
                       <Link to={`/products?category=${category.id}`} className="category-explore-link" > Explore Collection → </Link>
                        </div> </div> ))}
                         </div> )} </main> ); }
 export default Categories;