import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Package2,
  Wallet,
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
    section: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    section: "Sales & CRM",
    items: [
      { 
        label: "Dealers", 
        icon: Users, 
        subItems: [
          { label: "All Dealers", href: "/dealers" },
          { label: "Area Network", href: "/dealers/area-network" },
        ] 
      },
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
        label: "Invoices",
        icon: BarChart3,
        subItems: [
          { label: "All Invoices", href: "/sales/invoice-list" },
          { label: "Create Invoice", href: "/sales/create-invoice" },
        ],
      },
    ],
  },
  {
    section: "Procurement",
    items: [
      { label: "Suppliers", icon: Users, href: "/suppliers" },
      {
        label: "Purchases",
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
        label: "Items Catalog",
        icon: Package,
        subItems: [
          { label: "All Items", href: "/inventory/items" },
        ],
      },
      {
        label: "Stock Handling",
        icon: Package2,
        subItems: [
          { label: "Stock List", href: "/stock/list" },
          { label: "Stock Summary", href: "/stock/summary" },
        ],
      },
    ],
  },
  {
    section: "Finance & Reports",
    items: [
      { label: "Income Statement", icon: BarChart3, href: "/finance/income-statement" },
      { label: "Profit & Loss", icon: BarChart3, href: "/reports/profit-loss" },
      { 
        label: "Cash Flow", 
        icon: Wallet,
        subItems: [
          { label: "Income", href: "/finance/income" },
          { label: "Expenses", href: "/finance/expenses" },
        ]
      },
    ],
  },
  {
    section: "Administration",
    items: [
      { label: "User Management", icon: Users, href: "/users" },
      { label: "Access Control", icon: Settings, href: "/users/roles" },
      { label: "System Settings", icon: Settings, href: "/settings" },
    ],
  },
]
