"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CATEGORIES,
  DEFAULT_QUERY,
  fetchProducts,
  ProductDraftSchema,
  SearchQuerySchema,
  SORT_FIELDS,
} from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;

    fetchProducts(DEFAULT_QUERY)
      .then((list) => {
        if (active) {
          setProducts(list.products);
          setStatus("ready");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
    setErrorMessage("");
  }

  function showError(error: unknown) {
    setErrorMessage(error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ");
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    if (editing) {
      setProducts((current) =>
        current.map((item) => (item.id === editing.id ? { ...item, ...draft } : item)),
      );
      setEditing(null);
      return;
    }

    setProducts((current) => [...current, { ...draft, id: Date.now() }]);
  }

  function removeProduct(id: number) {
    setProducts((current) => current.filter((item) => item.id !== id));
    if (editing?.id === id) {
      setEditing(null);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">WEB231 · RHF · ZOD · EXTERNAL API</p>
          <h1>Product Explorer</h1>
        </div>
        <p className="student-id">
          <span>Aekkarach</span>
          <strong>400</strong>
        </p>
      </header>

      <button
        className="reload-button"
        type="button"
        onClick={() => void loadProducts(DEFAULT_QUERY)}
        disabled={status === "loading"}
      >
        {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
      </button>

      <SearchForm onSearch={loadProducts} />

      <section className="results" aria-live="polite">
        {status === "loading" && <p className="notice">กำลังโหลดข้อมูลสินค้า...</p>}
        {status === "error" && <p className="notice error" role="alert">{errorMessage}</p>}
        {status === "ready" && products.length === 0 && (
          <p className="notice">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}
        {status === "ready" && products.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>หมวดหมู่</th>
                  <th>รูปภาพ</th>
                  {isLoggedIn && <th>จัดการ</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)}</td>
                    <td>{item.stock}</td>
                    <td>{item.category}</td>
                    <td>
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="product-image" src={item.thumbnail} alt={item.title} />
                      ) : (
                        <span className="no-image">ไม่มีรูป</span>
                      )}
                    </td>
                    {isLoggedIn && (
                      <td className="actions">
                        <button type="button" onClick={() => setEditing(item)}>แก้ไข</button>
                        <button type="button" onClick={() => removeProduct(item.id)}>ลบ</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isLoggedIn ? (
        <ProductForm
          key={editing?.id ?? "new"}
          editing={editing}
          onSave={saveProduct}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <p className="notice">เข้าสู่ระบบด้วย Google เพื่อจัดการสินค้า</p>
      )}
    </main>
  );
}

function SearchForm({ onSearch }: { onSearch: (query: SearchQuery) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: DEFAULT_QUERY,
  });

  return (
    <form className="search-form" onSubmit={handleSubmit(onSearch)} noValidate>
      <div className="field">
        <label htmlFor="search-query">คำค้น</label>
        <input id="search-query" {...register("q")} placeholder="phone" />
      </div>
      <div className="field">
        <label htmlFor="search-limit">จำนวนรายการ</label>
        <input
          id="search-limit"
          type="number"
          min="1"
          max="30"
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={Boolean(errors.limit)}
          aria-describedby="search-limit-error"
        />
        <span id="search-limit-error" className="field-error" role="alert">
          {errors.limit?.message}
        </span>
      </div>
      <div className="field">
        <label htmlFor="search-sort">เรียงตาม</label>
        <select id="search-sort" {...register("sortBy")}>
          {SORT_FIELDS.map((field) => <option key={field} value={field}>{field}</option>)}
        </select>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
      </button>
    </form>
  );
}

function ProductForm({
  editing,
  onSave,
  onCancel,
}: {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
          thumbnail: editing.thumbnail,
        }
      : { title: "", price: 0, stock: 0, category: CATEGORIES[0] },
  });

  return (
    <form className="product-form" onSubmit={handleSubmit(onSave)} noValidate>
      <div className="form-heading">
        <h2>{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
        <p>{editing ? "ปรับปรุงข้อมูลรายการที่เลือก" : "กรอกข้อมูลสินค้าใหม่"}</p>
      </div>

      <div className="field">
        <label htmlFor="product-title">ชื่อสินค้า</label>
        <input id="product-title" {...register("title")} aria-invalid={Boolean(errors.title)} />
        <span className="field-error" role="alert">{errors.title?.message}</span>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="product-price">ราคา (USD)</label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.price)}
          />
          <span className="field-error" role="alert">{errors.price?.message}</span>
        </div>
        <div className="field">
          <label htmlFor="product-stock">จำนวนคงเหลือ</label>
          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            {...register("stock", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.stock)}
          />
          <span className="field-error" role="alert">{errors.stock?.message}</span>
        </div>
      </div>
      <div className="field">
        <label htmlFor="product-category">หมวดหมู่</label>
        <select
          id="product-category"
          {...register("category")}
          aria-invalid={Boolean(errors.category)}
        >
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <span className="field-error" role="alert">{errors.category?.message}</span>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={!isDirty || !isValid}>
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editing && <button type="button" onClick={onCancel}>ยกเลิก</button>}
      </div>
    </form>
  );
}