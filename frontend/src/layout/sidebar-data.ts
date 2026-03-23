import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Package2,
} from "lucide-react"

import type { ComponentType } from "react"

export type LucideIcon = ComponentType<{ className?: string; [key: string]: any }>;

export interface SubItem {
  label: string
  href: string
}

export interface NavItem {
  label: string
  icon: LucideIcon
  href?: string
  subItems?: SubItem[]
}

export interface NavSection {
  section: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    section: "Sales & Invoicing",
    items: [
      {
        label: "Sales",
        icon: ShoppingCart,
        subItems: [
          { label: "Sales List", href: "/sales/list" },
          { label: "Sales Area", href: "/sales-area/list" },
          { label: "Sales Targets", href: "/sales-target/report" },
        ],
      },
      {
        label: "Invoice",
        icon: BarChart3,
        subItems: [
          { label: "All Invoices", href: "/sales/invoice-list" },
          { label: "Create Invoice", href: "/sales/create-invoice" },
        ],
      },
    ],
  },
  {
    section: "Purchasing",
    items: [
      {
        label: "Purchase",
        icon: ShoppingCart,
        subItems: [
          { label: "Purchase List", href: "/purchase/list" },
          { label: "Create Purchase", href: "/purchase/create" },
        ],
      },
    ],
  },
  {
    section: "Inventory",
    items: [
      {
        label: "Stock",
        icon: Package2,
        subItems: [
          { label: "Stock List", href: "/stock/list" },
          { label: "Stock Summary", href: "/stock/summary" },
          { label: "Stock Report", href: "/inventory/stock-report" },
        ],
      },
      {
        label: "Items",
        icon: Package,
        subItems: [
          { label: "All Items", href: "/inventory/items" },
        ],
      },
    ],
  },
  {
    section: "Partners",
    items: [
      { label: "Dealer", icon: Users, href: "/dealers" },
      { label: "Supplier", icon: Users, href: "/suppliers" },
    ],
  },
  {
    section: "Administrative",
    items: [
      { label: "User", icon: Users, href: "/users" },
      { label: "Roles", icon: Settings, href: "/users/roles" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
]
