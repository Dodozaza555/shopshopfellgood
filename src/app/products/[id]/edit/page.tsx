import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { updateProductAction } from "@/app/actions";
import { SiteHeader } from "@/app/site-header";
import { getProduct } from "@/lib/store-products";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main className="storefront">
      <SiteHeader />
      <section className="management-panel">
        <p className="store-eyebrow">UPDATE ITEM</p>
        <h1>แก้ไขสินค้า</h1>
        <p className="management-intro">ปรับรายละเอียดสินค้าในคอลเลกชัน</p>
        <form className="management-form" action={updateAction}>
          <div className="field">
            <label htmlFor="name">ชื่อสินค้า</label>
            <input id="name" name="name" defaultValue={product.name} required />
          </div>
          <div className="field">
            <label htmlFor="price">ราคา</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.price}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="description">รายละเอียด</label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              required
            />
          </div>
          <div className="management-actions">
            <button type="submit">บันทึก</button>
            <Link href="/">ยกเลิก</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
