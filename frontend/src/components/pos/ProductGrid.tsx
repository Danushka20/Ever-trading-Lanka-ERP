import React from "react"

type Props = {
  products: any[]
  onProductSelect: (p: any) => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
  categories?: any[]
  selectedCategory?: string
  onCategoryChange?: (c: string) => void
}

export const ProductGrid: React.FC<Props> = ({
  products = [],
  onProductSelect,
  searchQuery = "",
  onSearchChange = () => {},
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {}
}) => {
  return (
    <div className="flex-1 bg-white rounded shadow p-4 overflow-auto">
      <div className="mb-4 flex gap-2">
        <input
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border rounded px-2 py-1"
        />
        <select
          value={selectedCategory}
          onChange={e => onCategoryChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id.toString()}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {products.map(p => (
          <button
            key={p.id}
            onClick={() => onProductSelect(p)}
            className="bg-slate-50 border rounded p-3 text-left hover:shadow"
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-slate-500">{p.category}</div>
            <div className="mt-2 font-medium">{p.price}</div>
            <div className="text-xs text-slate-400">Stock: {p.stock ?? 0}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGrid
