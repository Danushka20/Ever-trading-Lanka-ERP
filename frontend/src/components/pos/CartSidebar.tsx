import React from "react"

type Props = {
  items: any[]
  onUpdateQty?: (id: string | number, delta: number) => void
  onRemove?: (id: string | number) => void
  onComplete?: () => void
  children?: React.ReactNode
}

export const CartSidebar: React.FC<Props> = ({ items = [], onUpdateQty = () => {}, onRemove = () => {}, onComplete = () => {}, children }) => {
  const subTotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0)

  return (
    <aside className="w-96 bg-white border-l p-4 flex flex-col">
      <div className="flex-1 overflow-auto">
        <h3 className="text-lg font-semibold mb-3">Cart</h3>
        {items.length === 0 && <div className="text-sm text-slate-500">Cart is empty</div>}
        <ul className="space-y-3">
          {items.map(item => (
            <li key={item.id} className="flex items-start justify-between bg-slate-50 p-2 rounded">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-slate-500">{item.price} x {item.qty}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <button onClick={() => onUpdateQty(item.id, -1)} className="px-2 py-1 border rounded">-</button>
                  <div className="px-2">{item.qty}</div>
                  <button onClick={() => onUpdateQty(item.id, 1)} className="px-2 py-1 border rounded">+</button>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-xs text-red-500">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        {children}

        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between mb-3">
            <div className="text-sm text-slate-600">Subtotal</div>
            <div className="font-medium">{subTotal}</div>
          </div>
          <button onClick={onComplete} className="w-full bg-sky-600 text-white py-2 rounded">Complete Sale</button>
        </div>
      </div>
    </aside>
  )
}

export default CartSidebar
