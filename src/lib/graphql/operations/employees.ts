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
