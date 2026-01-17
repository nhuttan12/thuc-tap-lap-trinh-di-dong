export class UserProfileResponseDto {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    address: string | null;
    avatarUrl: string | null;
}
