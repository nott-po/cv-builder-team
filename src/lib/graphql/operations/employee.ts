export const USER_QUERY = `
    query GetUser($userId: ID!) {
        user(userId: $userId) {
            id
            created_at
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
