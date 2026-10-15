"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Trash2,
  Eye,
  AlertCircle,
  Upload,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/types/product";
import { slugify } from "@/lib/utils";

interface ProductEditorProps {
  initialProduct?: Product | null;
  isNew?: boolean;
}

export function ProductEditor({ initialProduct, isNew = false }: ProductEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialProduct?.title || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [category, setCategory] = useState<string>(initialProduct?.category || "Guide");
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || initialProduct?.tagline || ""
  );
  const [fullDescription, setFullDescription] = useState(
    initialProduct?.fullDescription || initialProduct?.description || ""
  );
  const [priceInRupees, setPriceInRupees] = useState(
    initialProduct ? (initialProduct.price / 100).toString() : "99"
  );
  const [originalPriceInRupees, setOriginalPriceInRupees] = useState(
    initialProduct?.originalPrice ? (initialProduct.originalPrice / 100).toString() : "499"
  );
  const [coverImage, setCoverImage] = useState(
    initialProduct?.coverImage || "/images/ai-28-days-cover.png"
  );
  const [fileReference, setFileReference] = useState(
    initialProduct?.fileReference || "master-ai-28-days-guide.pdf"
  );
  const [isPublished, setIsPublished] = useState(initialProduct?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingEbook, setUploadingEbook] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (isNew || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleFileUpload = async (
    file: File,
    folder: "images" | "vault",
    onSuccess: (val: string) => void,
    setLoadingState: (loading: boolean) => void
  ) => {
    setLoadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onSuccess(data.url || data.filename);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setLoadingState(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      alert("Title and URL Slug are required.");
      return;
    }

    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    const payload = {
      title,
      slug,
      category,
      shortDescription,
      tagline: shortDescription,
      fullDescription,
      description: fullDescription,
      price: Math.round(parseFloat(priceInRupees || "0") * 100),
      originalPrice: originalPriceInRupees
        ? Math.round(parseFloat(originalPriceInRupees) * 100)
        : undefined,
      coverImage: coverImage.trim() || "/images/ai-28-days-cover.png",
      galleryImages: [coverImage.trim() || "/images/ai-28-days-cover.png"],
      fileReference: fileReference.trim() || `${slug}.pdf`,
      isPublished,
      isFeatured,
    };

    try {
      const url = isNew ? "/api/products" : `/api/products/${initialProduct?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      setSavedSuccess(true);
      router.refresh();

      setTimeout(() => {
        setSavedSuccess(false);
        router.push("/admin/products");
      }, 1200);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialProduct?.id) return;
    if (!confirm(`Are you sure you want to delete "${initialProduct.title}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${initialProduct.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#707082] hover:text-[#0B0B0E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="flex items-center gap-3">
          {!isNew && slug && (
            <Link href={`/products/${slug}`} target="_blank">
              <Button type="button" variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                Preview Live Page
              </Button>
            </Link>
          )}

          {!isNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={isDeleting}
              onClick={handleDelete}
              className="text-[#7F1D1D] hover:bg-[#FFF1F2] border-[#FECDD3]"
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            {isNew ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Product successfully saved and published!
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#7F1D1D] text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {errorMessage}
        </div>
      )}

      {/* General Information */}
      <Card variant="bordered" padding="lg" className="bg-white space-y-5">
        <h2 className="text-base font-bold text-[#0B0B0E] border-b border-[#F2F2F5] pb-3">
          Product Details
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Product Name / Title"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Master AI in 28 Days"
            required
          />

          <Input
            label="URL Slug (Link Path)"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="master-ai-in-28-days"
            hint={`Public URL: /products/${slug || "..."}`}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            >
              <option value="Guide">Guide / Ebook</option>
              <option value="Prompt Pack">Prompt Pack</option>
              <option value="Course">Interactive Course</option>
              <option value="Blueprint">Blueprint &amp; Kit</option>
              <option value="Template">Template</option>
            </select>
          </div>

          <Input
            label="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A practical, beginner-friendly roadmap to understand AI..."
            hint="Displayed under titles and on product cards."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
            Full Description
          </label>
          <textarea
            rows={5}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Describe what the customer receives, key benefits, and practical applications..."
            className="w-full rounded-xl border border-[#E5E5EB] bg-white text-[#0B0B0E] text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            required
          />
        </div>
      </Card>

      {/* Pricing & File Uploads */}
      <Card variant="bordered" padding="lg" className="bg-white space-y-5">
        <h2 className="text-base font-bold text-[#0B0B0E] border-b border-[#F2F2F5] pb-3">
          Pricing &amp; Digital Files
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            label="Selling Price (₹ INR)"
            type="number"
            value={priceInRupees}
            onChange={(e) => setPriceInRupees(e.target.value)}
            placeholder="99"
            hint="Amount the customer pays."
            required
          />

          <Input
            label="Original / Strikethrough Price (₹ INR)"
            type="number"
            value={originalPriceInRupees}
            onChange={(e) => setOriginalPriceInRupees(e.target.value)}
            placeholder="499"
            hint="Optional. Displays savings badge."
          />
        </div>

        {/* Cover Image Upload */}
        <div className="pt-3 border-t border-[#F2F2F5]">
          <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
            Product Cover Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-28 h-28 rounded-xl bg-[#FAFAFC] border border-[#E5E5EB] overflow-hidden flex items-center justify-center shrink-0">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt="Cover Preview"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-[#707082]">No cover</span>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E5EB] bg-[#FAFAFC] hover:bg-white text-xs font-semibold text-[#0B0B0E] cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{uploadingCover ? "Uploading cover..." : "Upload Cover Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(
                        file,
                        "images",
                        (url) => setCoverImage(url),
                        setUploadingCover
                      );
                    }
                  }}
                />
              </label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/images/ai-28-days-cover.png"
                hint="Or enter an image path / URL manually."
              />
            </div>
          </div>
        </div>

        {/* Digital Ebook / PDF File Upload */}
        <div className="pt-3 border-t border-[#F2F2F5]">
          <label className="block text-xs font-bold text-[#0B0B0E] uppercase tracking-wider mb-1.5">
            Digital Ebook / PDF File
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#D97706]" />
            </div>

            <div className="space-y-2 flex-1">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E5EB] bg-[#FAFAFC] hover:bg-white text-xs font-semibold text-[#0B0B0E] cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{uploadingEbook ? "Uploading ebook..." : "Upload Ebook / PDF to Vault"}</span>
                <input
                  type="file"
                  accept=".pdf,.zip,.epub,.md,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(
                        file,
                        "vault",
                        (ref) => setFileReference(ref),
                        setUploadingEbook
                      );
                    }
                  }}
                />
              </label>
              <Input
                value={fileReference}
                onChange={(e) => setFileReference(e.target.value)}
                placeholder="master-ai-in-28-days-edition-2026.pdf"
                hint="Stored securely in server vault for verified downloads."
              />
            </div>
          </div>
        </div>

        {/* Publication Status Checkbox */}
        <div className="pt-4 border-t border-[#F2F2F5] flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-[#F59E0B] rounded"
            />
            <div>
              <p className="text-sm font-bold text-[#0B0B0E]">Published to Website</p>
              <p className="text-xs text-[#707082]">
                Check to display on the public storefront.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#F59E0B] rounded"
            />
            <div>
              <p className="text-sm font-bold text-[#0B0B0E]">Featured Flagship Product</p>
              <p className="text-xs text-[#707082]">
                Spotlighted in homepage hero section.
              </p>
            </div>
          </label>
        </div>
      </Card>
    </form>
  );
}
