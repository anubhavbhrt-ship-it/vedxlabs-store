import React from "react";
import { ProductEditor } from "@/components/admin/ProductEditor";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Create Digital Product</h1>
        <p className="text-sm text-[#717171]">
          Set up a new course, guide, template, or digital asset.
        </p>
      </div>

      <ProductEditor isNew={true} />
    </div>
  );
}
