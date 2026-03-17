export const LANGUAGES_QUERY = `
    query Languages {
        languages {
            id
            iso2
            name
            native_name
        }
    }
`;

export const CREATE_LANGUAGE_MUTATION = `
    mutation CreateLanguage($language: CreateLanguageInput!) {
        createLanguage(language: $language) {
            id
            iso2
            name
            native_name
        }
    }
`;

export const UPDATE_LANGUAGE_MUTATION = `
    mutation UpdateLanguage($language: UpdateLanguageInput!) {
        updateLanguage(language: $language) {
            id
            iso2
            name
            native_name
        }
    }
`;

export const DELETE_LANGUAGE_MUTATION = `
    mutation DeleteLanguage($language: DeleteLanguageInput!) {
        deleteLanguage(language: $language) {
            affected
        }
    }
`;

export const ADD_PROFILE_LANGUAGE_MUTATION = `
    mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
        addProfileLanguage(language: $language) {
            id
            languages {
                name
                proficiency
            }
        }
    }
`;

export const UPDATE_PROFILE_LANGUAGE_MUTATION = `
    mutation UpdateProfileLanguage($language: UpdateProfileLanguageInput!) {
        updateProfileLanguage(language: $language) {
            id
            languages {
                name
                proficiency
            }
        }
    }
`;

export const DELETE_PROFILE_LANGUAGE_MUTATION = `
    mutation DeleteProfileLanguage($language: DeleteProfileLanguageInput!) {
        deleteProfileLanguage(language: $language) {
            id
            languages {
                name
                proficiency
            }
        }
    }
`;
