"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { parseImages } from "@/lib/utils";
import { ProductImage } from "@/components/store/ProductImage";

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
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(() =>
    product ? parseImages(product.images) : []
  );
  const [urlDraft, setUrlDraft] = useState("");

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setUrlDraft("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [...prev, data.url as string]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (images.length === 0) {
      setError("Add at least one image (upload or URL)");
      setLoading(false);
      return;
    }

    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      price: Math.round(Number(form.get("price")) * 100),
      compareAt: form.get("compareAt")
        ? Math.round(Number(form.get("compareAt")) * 100)
        : null,
      images,
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

      <div className="space-y-4 border border-[var(--line)] bg-white p-4">
        <p className="label mb-0">Product images</p>
        <p className="text-sm text-[var(--muted)]">
          Upload files and/or paste image URLs. At least one image is required.
        </p>

        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((src, index) => (
              <li
                key={`${src.slice(0, 40)}-${index}`}
                className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)]"
              >
                <ProductImage src={src} alt={`Image ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div>
          <label className="label">Upload from device</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="input cursor-pointer file:mr-3 file:border-0 file:bg-[var(--surface)] file:px-3 file:py-1 file:text-sm"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading && (
            <p className="mt-2 text-sm text-[var(--muted)]">Uploading…</p>
          )}
        </div>

        <div>
          <label className="label">Or paste image URL</label>
          <div className="flex gap-2">
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              className="input"
              placeholder="https://…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={addUrl}
              className="btn-secondary shrink-0"
            >
              Add URL
            </button>
          </div>
        </div>
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
      <button
        type="submit"
        className="btn-primary"
        disabled={loading || uploading}
      >
        {loading ? "Saving…" : product ? "Update product" : "Add product"}
      </button>
    </form>
  );
}
