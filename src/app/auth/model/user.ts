export interface User {
    email: string,
    password: string,
    token?: string
}

export interface loginResponse {
    email: string
    isLoggedIn: boolean
    token: string
    userId: string,
    userType: number,
    emailVerified : boolean
}

export interface completeAuth {
    email: string
    token: string
    userId: string,
    name: string,
    userType: number,
    birthDate: string,
    gender: string,
    mobileNumber: string,
    password: string,
    profileImage: string,
    username: string
}

export interface ProfileResponse {
    birthDate: string,
    email: string,
    gender: string,
    mobileNumber: string,
    name: string,
    password: string,
    profileImage: string,
    userObjectId: string,
    username: string
}
