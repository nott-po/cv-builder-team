export const USERS_QUERY = `
    query Users {
        users {
            id
            email
            role
            department_name
            department {
                id
            }
            position_name
            position {
                id
            }
            profile {
                first_name
                last_name
                avatar
            }
        }
    }
`;

export type DepartmentsResult = { departments: { id: string; name: string }[] };
export type PositionsResult = { positions: { id: string; name: string }[] };

export const DEPARTMENTS_QUERY = `
    query Departments {
        departments {
            id
            name
        }
    }
`;

export const POSITIONS_QUERY = `
    query Positions {
        positions {
            id
            name
        }
    }
`;

export const CREATE_USER_MUTATION = `
    mutation CreateUser($user: CreateUserInput!) {
        createUser(user: $user) {
            id
            email
        }
    }
`;

export const UPDATE_USER_MUTATION = `
    mutation UpdateUser($user: UpdateUserInput!) {
        updateUser(user: $user) {
            id
            email
        }
    }
`;

export const UPDATE_PROFILE_MUTATION = `
    mutation UpdateProfile($profile: UpdateProfileInput!) {
        updateProfile(profile: $profile) {
            id
            first_name
            last_name
        }
    }
`;

export const DELETE_USER_MUTATION = `
    mutation DeleteUser($userId: ID!) {
        deleteUser(userId: $userId) {
            affected
        }
    }
`;
