import ProductBrowser from "@/components/ProductBrowser";

export default function HomePage() {
  return (
    <main className="page" id="main-content">
      <section className="hero">
        <div>
          <p className="eyebrow">Location-based gadget shopping</p>
          <h1>Buy gadgets available near you.</h1>
          <p className="heroText">
            See prices and stock based on your current location. Add items to
            your cart and place a basic order without payment integration.
          </p>
        </div>
      </section>

      <ProductBrowser />
    </main>
  );
}
