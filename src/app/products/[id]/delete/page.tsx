import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { deleteProductAction } from "@/app/actions";
import { SiteHeader } from "@/app/site-header";
import { getProduct } from "@/lib/store-products";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="storefront">
      <SiteHeader />
      <section className="management-panel">
        <p className="store-eyebrow">REMOVE ITEM</p>
        <h1>ยืนยันการลบ</h1>
        <p className="management-intro">
          ต้องการลบสินค้า “{product.name}” หรือไม่?
        </p>
        <div className="management-actions">
          <form action={deleteAction}>
            <button className="danger-button" type="submit">
              ยืนยันการลบ
            </button>
          </form>
          <Link href="/">ยกเลิก</Link>
        </div>
      </section>
    </main>
  );
}
