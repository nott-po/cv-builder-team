export const SKILLS_QUERY = `
    query Skills {
        skills {
            id
            name
            category_name
            category_parent_name
            category {
                id
                name
            }
        }
    }
`;

export const SKILL_CATEGORIES_QUERY = `
    query SkillCategories {
        skillCategories {
            id
            name
            order
            parent {
                id
                name
            }
        }
    }
`;

export const CREATE_SKILL_MUTATION = `
    mutation CreateSkill($skill: CreateSkillInput!) {
        createSkill(skill: $skill) {
            id
            name
            category_name
            category_parent_name
            category {
                id
                name
            }
        }
    }
`;

export const UPDATE_SKILL_MUTATION = `
    mutation UpdateSkill($skill: UpdateSkillInput!) {
        updateSkill(skill: $skill) {
            id
            name
            category_name
            category_parent_name
            category {
                id
                name
            }
        }
    }
`;

export const DELETE_SKILL_MUTATION = `
    mutation DeleteSkill($skill: DeleteSkillInput!) {
        deleteSkill(skill: $skill) {
            affected
        }
    }
`;
