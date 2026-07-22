// ============================================================
// Core Entity Types
// ============================================================

export type UserRole = 'super_admin' | 'admin' | 'dispatcher' | 'driver' | 'customer'

export interface User {
  id: string
  email: string
  username?: string
  first_name: string
  last_name: string
  full_name: string
  role: UserRole
  phone?: string | null
  avatar_url?: string | null
  is_active: boolean
  is_verified: boolean
  company_id: string
  branch_id?: string | null
  created_at: string
  updated_at: string
  last_login?: string | null
}

export interface Company {
  id: string
  name: string
  slug: string
  logo_url?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country: string
  is_active: boolean
  created_at: string
}

export interface Branch {
  id: string
  company_id: string
  name: string
  code: string
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  phone?: string | null
  email?: string | null
  is_active: boolean
  created_at: string
}

// ============================================================
// Customer Types
// ============================================================

export type CustomerType = 'individual' | 'business'
export type CustomerStatus = 'active' | 'inactive' | 'suspended'

export interface Customer {
  id: string
  company_id: string
  customer_number: string
  name: string
  customer_type: CustomerType
  status: CustomerStatus
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country: string
  contact_person?: string | null
  credit_limit: number
  outstanding_balance: number
  total_orders: number
  total_revenue: number
  notes?: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Driver Types
// ============================================================

export type DriverStatus = 'available' | 'on_trip' | 'off_duty' | 'unavailable'
export type LicenseClass = 'A' | 'B' | 'C' | 'D'

export interface Driver {
  id: string
  company_id: string
  user_id?: string | null
  driver_number: string
  first_name: string
  last_name: string
  full_name: string
  email?: string | null
  phone: string
  status: DriverStatus
  license_number: string
  license_class: LicenseClass
  license_expiry: string
  date_of_birth?: string | null
  hire_date?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  total_trips: number
  total_miles: number
  rating: number
  is_active: boolean
  notes?: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Vehicle Types
// ============================================================

export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'retired'
export type VehicleType = 'semi_truck' | 'flatbed' | 'refrigerated' | 'tanker' | 'box_truck' | 'pickup' | 'van' | 'other'

export interface Vehicle {
  id: string
  company_id: string
  vehicle_number: string
  vin?: string | null
  type: VehicleType
  make: string
  model: string
  year: number
  status: VehicleStatus
  license_plate: string
  state_registered: string
  capacity_weight: number
  capacity_volume?: number | null
  fuel_type: string
  color?: string | null
  mileage: number
  last_service_date?: string | null
  next_service_date?: string | null
  insurance_expiry?: string | null
  registration_expiry?: string | null
  current_driver_id?: string | null
  current_driver?: Driver | null
  notes?: string | null
  is_active: boolean
  total_trips: number
  created_at: string
  updated_at: string
}

// ============================================================
// Freight Order Types
// ============================================================

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'on_hold'

export type FreightType = 'general' | 'hazmat' | 'refrigerated' | 'oversized' | 'fragile' | 'bulk'
export type ServiceType = 'standard' | 'express' | 'economy' | 'same_day'

export interface OrderLocation {
  id: string
  order_id: string
  sequence: number
  type: 'pickup' | 'delivery' | 'waypoint'
  address: string
  city: string
  state: string
  zip: string
  country: string
  contact_name?: string | null
  contact_phone?: string | null
  scheduled_date?: string | null
  actual_date?: string | null
  notes?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface FreightOrder {
  id: string
  company_id: string
  order_number: string
  status: OrderStatus
  customer_id: string
  customer?: Customer | null
  freight_type: FreightType
  service_type: ServiceType
  weight: number
  volume?: number | null
  pieces?: number | null
  description?: string | null
  special_instructions?: string | null
  pickup_date?: string | null
  delivery_date?: string | null
  actual_pickup_date?: string | null
  actual_delivery_date?: string | null
  base_rate: number
  fuel_surcharge: number
  accessorial_charges: number
  total_amount: number
  distance?: number | null
  locations: OrderLocation[]
  current_dispatch_id?: string | null
  notes?: string | null
  created_by?: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Dispatch Types
// ============================================================

export type DispatchStatus =
  | 'queued'
  | 'dispatched'
  | 'in_transit'
  | 'arrived'
  | 'completed'
  | 'cancelled'

export interface Dispatch {
  id: string
  company_id: string
  dispatch_number: string
  order_id: string
  order?: FreightOrder | null
  driver_id?: string | null
  driver?: Driver | null
  vehicle_id?: string | null
  vehicle?: Vehicle | null
  status: DispatchStatus
  dispatched_at?: string | null
  pickup_at?: string | null
  delivered_at?: string | null
  estimated_arrival?: string | null
  current_latitude?: number | null
  current_longitude?: number | null
  miles_driven?: number | null
  fuel_used?: number | null
  notes?: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Notification Types
// ============================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system'
export type NotificationCategory =
  | 'order'
  | 'dispatch'
  | 'driver'
  | 'vehicle'
  | 'customer'
  | 'payment'
  | 'system'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory
  is_read: boolean
  action_url?: string | null
  entity_id?: string | null
  entity_type?: string | null
  created_at: string
}

// ============================================================
// Document Types
// ============================================================

export type DocumentType =
  | 'invoice'
  | 'bill_of_lading'
  | 'pod'
  | 'license'
  | 'insurance'
  | 'registration'
  | 'other'

export interface Document {
  id: string
  company_id: string
  name: string
  document_type: DocumentType
  file_url: string
  file_size?: number | null
  mime_type?: string | null
  entity_id?: string | null
  entity_type?: string | null
  uploaded_by?: string | null
  created_at: string
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardStats {
  total_orders: number
  orders_today: number
  orders_change: number
  active_dispatches: number
  dispatches_change: number
  available_drivers: number
  total_drivers: number
  active_vehicles: number
  total_vehicles: number
  revenue_today: number
  revenue_month: number
  revenue_change: number
  deliveries_completed: number
  deliveries_change: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface OrderStatusBreakdown {
  status: OrderStatus
  count: number
  percentage: number
}

export interface DriverStatusBreakdown {
  available: number
  on_trip: number
  off_duty: number
  unavailable: number
}

export interface DashboardData {
  stats: DashboardStats
  revenue_trend: RevenueDataPoint[]
  order_status_breakdown: OrderStatusBreakdown[]
  driver_status: DriverStatusBreakdown
  recent_orders: FreightOrder[]
}

// ============================================================
// Report Types
// ============================================================

export interface ReportFilter {
  start_date: string
  end_date: string
  customer_id?: string
  driver_id?: string
  vehicle_id?: string
  status?: string
  freight_type?: string
}

export interface RevenueReport {
  period: string
  total_revenue: number
  orders_count: number
  avg_order_value: number
  top_customers: Array<{ customer_id: string; name: string; revenue: number }>
  by_freight_type: Array<{ type: string; revenue: number; count: number }>
}

export interface DriverPerformanceReport {
  driver_id: string
  driver_name: string
  total_trips: number
  total_miles: number
  on_time_rate: number
  avg_rating: number
  revenue_generated: number
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T
  message?: string
  status: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
  has_next: boolean
  has_prev: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// ============================================================
// Auth Types
// ============================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  company_name?: string
}

// ============================================================
// Form Types
// ============================================================

export interface CustomerFormData {
  name: string
  customer_type: CustomerType
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  contact_person?: string
  credit_limit?: number
  notes?: string
}

export interface DriverFormData {
  first_name: string
  last_name: string
  email?: string
  phone: string
  license_number: string
  license_class: LicenseClass
  license_expiry: string
  date_of_birth?: string
  hire_date?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  notes?: string
}

export interface VehicleFormData {
  vehicle_number?: string
  vin?: string
  type: VehicleType
  make: string
  model: string
  year: number
  license_plate: string
  state_registered: string
  capacity_weight: number
  capacity_volume?: number
  fuel_type: string
  color?: string
  mileage?: number
  insurance_expiry?: string
  registration_expiry?: string
  notes?: string
}

export interface OrderFormData {
  customer_id: string
  freight_type: FreightType
  service_type: ServiceType
  weight: number
  volume?: number
  pieces?: number
  description?: string
  special_instructions?: string
  pickup_date?: string
  delivery_date?: string
  base_rate: number
  fuel_surcharge?: number
  accessorial_charges?: number
  locations: Partial<OrderLocation>[]
  notes?: string
}

// ============================================================
// UI Types
// ============================================================

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface FilterOption {
  label: string
  value: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
  roles?: UserRole[]
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export type Theme = 'dark' | 'light'
