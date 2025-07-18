import { create } from 'zustand';

interface PriceObject {
  price: number | string;
  currency?: string;
  billingPeriod?: string;
  planName?: string;
  [key: string]: any;
}

interface FeatureDescription {
  value: string;
}

interface ProductFeature {
  title: string;
  description: FeatureDescription[];
}

interface CompareProduct {
  id: string;
  logo?: string;
  name: string;
  avgRating: number;
  totalReviews: number;
  websiteUrl?: string;
  logoBackground: string;
  description: string;
  users: string;
  industries: any[];
  marketSegment: any[];
  entryPrice: PriceObject[] | string; // Can be array of price objects or string
  slug?: string;
  features?: ProductFeature[]; // Add features array
  whoCanUse?: any[];
  isFree?: boolean;
  [key: string]: any;

}

interface CompareStore {
  // State
  products: CompareProduct[];
  isCompareModalOpen: boolean;
  
  // Actions
  addProduct: (product: CompareProduct) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  toggleCompareModal: () => void;
  setCompareModalOpen: (isOpen: boolean) => void;
  isProductInCompare: (productId: string) => boolean;
  canAddMore: () => boolean;
}

const MAX_COMPARE_PRODUCTS = 3;
const MIN_COMPARE_PRODUCTS = 2;

const useCompareStore = create<CompareStore>((set, get) => ({
  // Initial state
  products: [],
  isCompareModalOpen: false,
  
  // Add product to comparison
  addProduct: (product) => {
    const { products } = get();
    
    // Check if product already exists
    if (products.find(p => p.id === product.id)) {
      return;
    }
    
    // Check if we've reached the maximum
    if (products.length >= MAX_COMPARE_PRODUCTS) {
      return;
    }
    
    set({ products: [...products, product] });
  },
  
  // Remove product from comparison
  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter(p => p.id !== productId)
    }));
  },
  
  // Clear all products
  clearProducts: () => {
    set({ products: [], isCompareModalOpen: false });
  },
  
  // Toggle compare modal
  toggleCompareModal: () => {
    const { products } = get();
    
    // Only open if we have minimum products
    if (products.length >= MIN_COMPARE_PRODUCTS) {
      set((state) => ({ isCompareModalOpen: !state.isCompareModalOpen }));
    }
  },
  
  // Set compare modal open state
  setCompareModalOpen: (isOpen) => {
    const { products } = get();
    
    // Only open if we have minimum products
    if (isOpen && products.length < MIN_COMPARE_PRODUCTS) {
      return;
    }
    
    set({ isCompareModalOpen: isOpen });
  },
  
  // Check if product is in compare list
  isProductInCompare: (productId) => {
    const { products } = get();
    return products.some(p => p.id === productId);
  },
  
  // Check if we can add more products
  canAddMore: () => {
    const { products } = get();
    return products.length < MAX_COMPARE_PRODUCTS;
  }
}));

export default useCompareStore;
export { MAX_COMPARE_PRODUCTS, MIN_COMPARE_PRODUCTS };
export type { CompareProduct, CompareStore }; 