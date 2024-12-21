import { UserDto } from './Dtos/userDto.model';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addresses: Array<{
    addressLine: string;
    addressLine2: string;
    city: string;
    country: string;
  }>;

  constructor(userDto: UserDto) {
    this.id = userDto.id;
    this.firstName = userDto.firstName;
    this.lastName = userDto.lastName;
    this.email = userDto.email;
    this.phoneNumber = userDto.phoneNumber;
    this.addresses = userDto.addresses;
  }
}
