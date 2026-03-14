export const USERS_QUERY = `
    query Users {
        users {
            id
            email
            department_name
            position_name
            profile {
                first_name
                last_name
                avatar
            }
        }
    }
`;

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
