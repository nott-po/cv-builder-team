export const PROFILE_SKILLS_QUERY = `
    query ProfileSkills($userId: ID!) {
        profile(userId: $userId) {
            id
            skills {
                name
                mastery
            }
        }
    }
`;

export const ADD_PROFILE_SKILL_MUTATION = `
    mutation AddProfileSkill($skill: AddProfileSkillInput!) {
        addProfileSkill(skill: $skill) {
            id
            skills {
                name
                mastery
            }
        }
    }
`;

export const UPDATE_PROFILE_SKILL_MUTATION = `
    mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
        updateProfileSkill(skill: $skill) {
            id
            skills {
                name
                mastery
            }
        }
    }
`;

export const DELETE_PROFILE_SKILL_MUTATION = `
    mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
        deleteProfileSkill(skill: $skill) {
            id
            skills {
                name
                mastery
            }
        }
    }
`;

export const PROFILE_LANGUAGES_QUERY = `
    query ProfileLanguages($userId: ID!) {
        profile(userId: $userId) {
            id
            languages {
                name
                proficiency
            }
        }
    }
`;
