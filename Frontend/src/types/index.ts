export interface Product {
  _id: string;
  ProductName: string;
  Brand: string;
  Price: number;
  OfferPrice?: number;
  ProductImages: string[];
  Category: string | Category;
  Stock: number;
  Description: string;
  Ingredients: string[];
  NutritionalValue: {
    Protein: number;
    Calories: number;
    Carbs: number;
    Fat: number;
  };
  Benefits: string[];
  Usage: string;
  isFeatured: boolean;
  isOnOffer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  CategoryName: string;
  CategoryDescription: string;
  CategoryImage: string;
  isActive: boolean;
  Categories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  addedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data: T;
  message?: string;
}

export interface User {
  _id: string;
  Name: string;
  Email: string;
  Phone: string;
  Address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  Orders: string[];
  Cart: string[];
  Wishlist: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  OrderId: string;
  userId: string;
  Items: OrderItem[];
  TotalAmount: number;
  PaymentStatus: string;
  PaymentId?: string;
  PaymentMethod: string;
  PaymentDate?: string;
  ShippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  OrderStatus: string;
  ShippingDate?: string;
  DeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}
