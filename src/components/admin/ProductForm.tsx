"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseImages } from "@/lib/utils";

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAt: number | null;
    images: string;
    category: string;
    collection: string | null;
    featured: boolean;
    inStock: boolean;
  };
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const existingImages = product ? parseImages(product.images) : [];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const imageUrls = String(form.get("images"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      price: Math.round(Number(form.get("price")) * 100),
      compareAt: form.get("compareAt")
        ? Math.round(Number(form.get("compareAt")) * 100)
        : null,
      images: imageUrls,
      category: String(form.get("category")),
      collection: String(form.get("collection") || "") || null,
      featured: form.get("featured") === "on",
      inStock: form.get("inStock") === "on",
    };

    try {
      const res = await fetch(
        product ? `/api/products/${product.id}` : "/api/products",
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <label className="label">Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="input"
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="input"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Price (₹)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="1"
            required
            defaultValue={product ? product.price / 100 : ""}
            className="input"
          />
        </div>
        <div>
          <label className="label">Compare at (₹)</label>
          <input
            name="compareAt"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.compareAt ? product.compareAt / 100 : ""}
            className="input"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <input
            name="category"
            required
            defaultValue={product?.category || "Earrings"}
            className="input"
            placeholder="Earrings, Necklaces, Sets…"
          />
        </div>
        <div>
          <label className="label">Collection</label>
          <input
            name="collection"
            defaultValue={product?.collection || ""}
            className="input"
            placeholder="KAHAANI, ERA…"
          />
        </div>
      </div>
      <div>
        <label className="label">Image URLs (one per line)</label>
        <textarea
          name="images"
          required
          rows={4}
          defaultValue={existingImages.join("\n")}
          className="input font-mono text-sm"
          placeholder="https://…"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={product?.inStock ?? true}
          />
          In stock
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving…" : product ? "Update product" : "Add product"}
      </button>
    </form>
  );
}
