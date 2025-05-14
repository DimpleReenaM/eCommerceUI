

  export interface MyProduct {
    id: number;
    name: string;
    originalPrice: number;
    stockQuantity: number;
    discountPercentage?: number;
    discountAmount?: number;
    newPrice?: number;
    category: { id: number; name: string }; // important
    brand: { id: number; name: string };     // important
    description?: string;
    createdBy: number;
    isDeleted: boolean; // ✅ Add this
    thumbnail: {imageUrl:string}; // ✅ Add this line
  }
  