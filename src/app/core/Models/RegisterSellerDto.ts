export interface RegisterSellerDto {
    userName: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
    businessName: string;
    businessType: string; // Must match enum values from backend
    gstNumber: string;
  }
  