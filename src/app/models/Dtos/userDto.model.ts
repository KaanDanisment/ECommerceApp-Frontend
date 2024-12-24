export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addresses: Array<{
    id: number;
    addressLine: string;
    addressLine2: string;
    city: string;
    country: string;
  }>;
}
