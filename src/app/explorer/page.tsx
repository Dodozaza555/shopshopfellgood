import { auth } from "@/auth";
import ProductExplorer from "@/components/ProductExplorer";
import { SiteHeader } from "@/app/site-header";

export default async function ExplorerPage() {
  const session = await auth();

  return (
    <>
      <div className="storefront explorer-header">
        <SiteHeader />
      </div>
      <ProductExplorer isLoggedIn={Boolean(session?.user)} />
    </>
  );
}
