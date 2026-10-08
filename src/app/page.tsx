import Link from "next/link";

import { auth } from "@/auth";
import { getProducts } from "@/lib/store-products";
import { SiteHeader } from "@/app/site-header";

export default async function HomePage() {
  const session = await auth();
  const products = getProducts();
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="storefront">
      <SiteHeader />

      <section className="store-hero" aria-labelledby="store-title">
        <div className="store-hero-copy">
          <p className="store-eyebrow">TOOLS FOR EVERYDAY</p>
          <h1 id="store-title">เลือกชิ้นที่ใช่<br />ให้ทุกวันทำงาน</h1>
          <p className="store-hero-description">
            ไอเท็มทำงานที่คัดมาให้พอดีกับโต๊ะและทุกไอเดียของคุณ
          </p>
          <Link className="store-hero-link" href="/explorer">
            สำรวจสินค้า <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="store-hero-art" aria-hidden="true">
          <span className="hero-sun" />
          <span className="hero-keyboard" />
          <span className="hero-caption">GOOD TOOLS. GOOD DAYS.</span>
        </div>
      </section>

      <section className="store-catalog" aria-labelledby="catalog-title">
        <div className="store-section-heading">
          <div>
            <p className="store-eyebrow">THE EVERYDAY EDIT</p>
            <h2 id="catalog-title">ของใช้ทำงาน</h2>
          </div>
          <span className="store-count">
            {String(products.length).padStart(2, "0")} ITEMS
          </span>
        </div>

        {products.length > 0 ? (
          <div className="store-grid">
            {products.map((product, index) => (
              <article className="store-card" key={product.id} data-testid="product">
                <div
                  className={`store-card-art store-card-art--${product.id}`}
                  aria-hidden="true"
                >
                  <span className="store-card-index">0{index + 1}</span>
                  <span className="store-card-tag">WORKSPACE OBJECT</span>
                  <span className="store-product-object" />
                </div>
                <div className="store-card-content">
                  <p className="store-card-category">TOOLS FOR EVERYDAY</p>
                  <h3>{product.name}</h3>
                  <p className="store-card-description">{product.description}</p>
                  <div className="store-card-footer">
                    <strong>฿{product.price.toLocaleString("th-TH")}</strong>
                    {isLoggedIn && (
                      <div className="store-card-actions">
                        <Link href={`/products/${product.id}/edit`}>แก้ไข</Link>
                        <Link href={`/products/${product.id}/delete`}>ลบ</Link>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="notice">ไม่มีสินค้า</p>
        )}
      </section>

      <footer className="store-footer">
        <span>ของใช้ทำงาน ✳</span>
        <span>TOOLS FOR EVERYDAY</span>
      </footer>
    </main>
  );
}
