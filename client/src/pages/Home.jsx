import { Link } from "react-router-dom";
function Home() {
  return (
    <main className="home-page">
      {" "}
      {/* ========================================= HERO SECTION ========================================= */}{" "}
      <section className="home-hero">
        {" "}
        {/* Hero Background */}{" "}
        <img
          src="/images/banners/lucid-origin_artistic_portrait_photography_of_Luxury_modern_watch_e-commerce_website_hero_ban-0.jpg"
          alt="Luxury Watch Collection"
          className="hero-background-image"
        />{" "}
        {/* Dark Overlay */} <div className="hero-overlay"></div>{" "}
        {/* Hero Content */}{" "}
        <div className="home-hero-content">
          {" "}
          <p className="home-eyebrow"> TIMELESS COLLECTION </p>{" "}
          <h1>
            {" "}
            Time, designed <span>to be remembered.</span>{" "}
          </h1>{" "}
          <p className="home-description">
            {" "}
            Discover refined timepieces crafted for everyday elegance,
            confidence, and lasting style.{" "}
          </p>{" "}
          <div className="home-buttons">
            {" "}
            <Link to="/products" className="home-primary-btn">
              {" "}
              Explore Collection{" "}
            </Link>{" "}
            <Link to="/categories" className="home-secondary-btn">
              {" "}
              Shop by Category{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================= TRUST FEATURES ========================================= */}{" "}
      <section className="home-features">
        {" "}
        <div className="home-feature">
          {" "}
          <span className="feature-number"> 01 </span>{" "}
          <div>
            {" "}
            <h3> Refined Design </h3>{" "}
            <p> Carefully selected timepieces with timeless character. </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="home-feature">
          {" "}
          <span className="feature-number"> 02 </span>{" "}
          <div>
            {" "}
            <h3> Secure Shopping </h3>{" "}
            <p>
              {" "}
              A smooth and secure shopping experience from cart to
              checkout.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        <div className="home-feature">
          {" "}
          <span className="feature-number"> 03 </span>{" "}
          <div>
            {" "}
            <h3> Made to Last </h3>{" "}
            <p>
              {" "}
              Watches selected for style, quality, and everyday wear.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================= CATEGORIES ========================================= */}{" "}
      <section className="home-categories">
        {" "}
        <div className="section-heading">
          {" "}
          <div>
            {" "}
            <p className="section-eyebrow"> FIND YOUR STYLE </p>{" "}
            <h2> Shop by category </h2>{" "}
          </div>{" "}
          <Link to="/categories" className="section-link">
            {" "}
            View all →{" "}
          </Link>{" "}
        </div>{" "}
        <div className="category-grid">
          {" "}
          <Link to="/products" className="category-card category-men">
            {" "}
            <div className="category-overlay"></div>{" "}
            <div className="category-content">
              {" "}
              <span> 01 </span> <h3> Classic </h3>{" "}
              <p> Timeless everyday watches </p>{" "}
              <strong> Explore Collection → </strong>{" "}
            </div>{" "}
          </Link>{" "}
          <Link to="/products" className="category-card category-women">
            {" "}
            <div className="category-overlay"></div>{" "}
            <div className="category-content">
              {" "}
              <span> 02 </span> <h3> Elegant </h3>{" "}
              <p> Refined designs for every occasion </p>{" "}
              <strong> Explore Collection → </strong>{" "}
            </div>{" "}
          </Link>{" "}
          <Link to="/products" className="category-card category-premium">
            {" "}
            <div className="category-overlay"></div>{" "}
            <div className="category-content">
              {" "}
              <span> 03 </span> <h3> Signature </h3>{" "}
              <p> Distinctive statement timepieces </p>{" "}
              <strong> Explore Collection → </strong>{" "}
            </div>{" "}
          </Link>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================= BRAND STORY ========================================= */}{" "}
      <section className="home-story">
        {" "}
        <div className="story-visual">
          <img
            src="/images/catogories/lucid-origin_artistic_portrait_photography_of_Elegant_women_s_luxury_wristwatch_refined_silve-0.jpg"
            alt="Luxury watch"
            className="story-watch-image"
          />
        </div>
        <div className="story-content">
          {" "}
          <p className="section-eyebrow"> OUR PHILOSOPHY </p>{" "}
          <h2>
            {" "}
            The details make <span> the difference. </span>{" "}
          </h2>{" "}
          <p>
            {" "}
            We believe a watch is more than something that tells time. It is a
            quiet expression of personality, style, and the moments worth
            remembering.{" "}
          </p>{" "}
          <Link to="/about" className="story-link">
            {" "}
            Discover our story →{" "}
          </Link>{" "}
        </div>{" "}
      </section>{" "}
      {/* ========================================= FINAL CTA ========================================= */}{" "}
      <section className="home-cta">
        {" "}
        <img
          src="/images/banners/lucid-origin_Luxury_watch_sale_campaign_banner_premium_wristwatch_surrounded_by_subtle_elegan-0.jpg"
          alt="Luxury watch"
          className="home-cta-image"
        />{" "}
        <div className="home-cta-overlay"></div>{" "}
        <div className="home-cta-content">
          {" "}
          <p className="section-eyebrow">YOUR NEXT TIMEPIECE</p>{" "}
          <h2>
            {" "}
            Find a watch that <span>feels like yours.</span>{" "}
          </h2>{" "}
          <Link to="/products" className="home-primary-btn">
            {" "}
            Shop Watches{" "}
          </Link>{" "}
        </div>{" "}
      </section>
    </main>
  );
}
export default Home;
