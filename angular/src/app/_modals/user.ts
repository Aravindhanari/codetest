export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
    user_type: any;
}

export class UserType {
    id: number;
    text: string;
}