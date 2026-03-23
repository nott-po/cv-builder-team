export const USER_QUERY = `
    query GetUser($userId: ID!) {
        user(userId: $userId) {
            id
            created_at
            email
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

export const UPDATE_FULL_PROFILE_MUTATION = `
    mutation UpdateFullProfile($user: UpdateUserInput!, $profile: UpdateProfileInput!) {
        updateUser(user: $user) {
            id
            department_name
            position_name
        }

        updateProfile(profile: $profile) {
            id
            first_name
            last_name
        }
    }
`;

export const UPLOAD_AVATAR_MUTATION = `
    mutation UploadAvatar($avatar: UploadAvatarInput!) {
        uploadAvatar(avatar: $avatar)
    }
`;
