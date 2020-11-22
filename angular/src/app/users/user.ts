export class User {
    constructor(public id: number,
        public username: string,
        public email: string,
        public user_type: any,
        public firstName: string,
        public lastName: string,
        public address?: string,
        public description?: string,
        public user_location?: string,
        // public region?: any,
        // public vendorCategory?: any,
        public roleId?: any,
        public employee_code?:string,
        public permissions?: any,
        public accesses?: any,
        public customer_accesses?: any,
        public modified_Date?: any
       ) { }
}

export class UserType {
    id: number;
    text: string;
}
