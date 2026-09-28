import { Link } from "react-router-dom";
function About() {
  return (
    <main className="about-page">
      {" "}
      <section className="about-hero">
        {" "}
        <div className="about-hero-content">
          {" "}
          <p className="about-eyebrow">ABOUT WATCHSTORE</p>{" "}
          <h1>
            {" "}
            Timeless watches. <span>Personal style.</span>{" "}
          </h1>{" "}
          <p className="about-hero-description">
            {" "}
            We curate refined timepieces for people who value quality, elegant
            design, and lasting style.{" "}
          </p>{" "}
          <Link to="/products" className="about-primary-btn">
            {" "}
            Explore Collection →{" "}
          </Link>{" "}
        </div>{" "}
        <div className="about-hero-image">
          {" "}
          <img
            src="/images/about-watch.jpg"
            alt="Premium luxury wristwatch"
          />{" "}
        </div>{" "}
      </section>{" "}
      <section className="about-story">
        {" "}
        <div className="about-story-label">
          {" "}
          <p>01</p> <span>OUR STORY</span>{" "}
        </div>{" "}
        <div className="about-story-content">
          {" "}
          <p className="about-section-eyebrow">OUR APPROACH</p>{" "}
          <h2>
            {" "}
            Watches chosen with <span>purpose.</span>{" "}
          </h2>{" "}
          <p>
            {" "}
            A watch is more than an accessory. It is part of your everyday style
            and the moments you choose to remember.{" "}
          </p>{" "}
          <p>
            {" "}
            WATCHSTORE brings together carefully selected timepieces that
            balance timeless design, quality, and everyday wearability.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      <section className="about-philosophy">
        {" "}
        <div className="about-philosophy-heading">
          {" "}
          <p className="about-section-eyebrow">WHAT MATTERS TO US</p>{" "}
          <h2>
            {" "}
            Simple choices. <span>Thoughtful details.</span>{" "}
          </h2>{" "}
        </div>{" "}
        <div className="about-values">
          {" "}
          <div className="about-value">
            {" "}
            <span>01</span> <h3>Refined Design</h3>{" "}
            <p> Timeless styles selected to complement everyday looks. </p>{" "}
          </div>{" "}
          <div className="about-value">
            {" "}
            <span>02</span> <h3>Quality Focus</h3>{" "}
            <p>
              {" "}
              Attention to materials, craftsmanship, and lasting detail.{" "}
            </p>{" "}
          </div>{" "}
          <div className="about-value">
            {" "}
            <span>03</span> <h3>Easy Shopping</h3>{" "}
            <p>
              {" "}
              A clear and smooth experience from browsing to checkout.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="about-cta">
        {" "}
        <p className="about-section-eyebrow">FIND YOUR TIMEPIECE</p>{" "}
        <h2>
          {" "}
          Discover a watch that <span> fits your style.</span>{" "}
        </h2>{" "}
        <Link to="/products" className="about-primary-btn">
          {" "}
          Shop Watches →{" "}
        </Link>{" "}
      </section>{" "}
    </main>
  );
}
export default About;
