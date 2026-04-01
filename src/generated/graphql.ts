export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> =
    | T
    | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    Void: { input: any; output: any };
};

export type AddCvProjectInput = {
    cvId: Scalars["ID"]["input"];
    end_date?: InputMaybe<Scalars["String"]["input"]>;
    projectId: Scalars["ID"]["input"];
    responsibilities: Array<Scalars["String"]["input"]>;
    roles: Array<Scalars["String"]["input"]>;
    start_date: Scalars["String"]["input"];
};

export type AddCvSkillInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    cvId: Scalars["ID"]["input"];
    mastery: Mastery;
    name: Scalars["String"]["input"];
};

export type AddProfileLanguageInput = {
    name: Scalars["String"]["input"];
    proficiency: Proficiency;
    userId: Scalars["ID"]["input"];
};

export type AddProfileSkillInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    mastery: Mastery;
    name: Scalars["String"]["input"];
    userId: Scalars["ID"]["input"];
};

export type AuthInput = {
    email: Scalars["String"]["input"];
    password: Scalars["String"]["input"];
};

export type AuthResult = {
    __typename?: "AuthResult";
    access_token: Scalars["String"]["output"];
    refresh_token: Scalars["String"]["output"];
    user: User;
};

export type CreateCvInput = {
    description: Scalars["String"]["input"];
    education?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type CreateDepartmentInput = {
    name: Scalars["String"]["input"];
};

export type CreateLanguageInput = {
    iso2: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    native_name?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePositionInput = {
    name: Scalars["String"]["input"];
};

export type CreateProfileInput = {
    first_name?: InputMaybe<Scalars["String"]["input"]>;
    last_name?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateProjectInput = {
    description: Scalars["String"]["input"];
    domain: Scalars["String"]["input"];
    end_date?: InputMaybe<Scalars["String"]["input"]>;
    environment: Array<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    start_date: Scalars["String"]["input"];
};

export type CreateSkillInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    name: Scalars["String"]["input"];
};

export type CreateUserInput = {
    auth: AuthInput;
    cvsIds: Array<Scalars["String"]["input"]>;
    departmentId?: InputMaybe<Scalars["ID"]["input"]>;
    positionId?: InputMaybe<Scalars["ID"]["input"]>;
    profile: CreateProfileInput;
    role: UserRole;
};

export type Cv = {
    __typename?: "Cv";
    created_at: Scalars["String"]["output"];
    description: Scalars["String"]["output"];
    education?: Maybe<Scalars["String"]["output"]>;
    id: Scalars["ID"]["output"];
    languages: Array<LanguageProficiency>;
    name: Scalars["String"]["output"];
    projects?: Maybe<Array<CvProject>>;
    skills: Array<SkillMastery>;
    user?: Maybe<User>;
};

export type CvProject = {
    __typename?: "CvProject";
    description: Scalars["String"]["output"];
    domain: Scalars["String"]["output"];
    end_date?: Maybe<Scalars["String"]["output"]>;
    environment: Array<Scalars["String"]["output"]>;
    id: Scalars["ID"]["output"];
    internal_name: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    project: Project;
    responsibilities: Array<Scalars["String"]["output"]>;
    roles: Array<Scalars["String"]["output"]>;
    start_date: Scalars["String"]["output"];
};

export type DeleteAvatarInput = {
    userId: Scalars["ID"]["input"];
};

export type DeleteCvInput = {
    cvId: Scalars["ID"]["input"];
};

export type DeleteCvSkillInput = {
    cvId: Scalars["ID"]["input"];
    name: Array<Scalars["String"]["input"]>;
};

export type DeleteDepartmentInput = {
    departmentId: Scalars["ID"]["input"];
};

export type DeleteLanguageInput = {
    languageId: Scalars["ID"]["input"];
};

export type DeletePositionInput = {
    positionId: Scalars["ID"]["input"];
};

export type DeleteProfileInput = {
    userId: Scalars["ID"]["input"];
};

export type DeleteProfileLanguageInput = {
    name: Array<Scalars["String"]["input"]>;
    userId: Scalars["ID"]["input"];
};

export type DeleteProfileSkillInput = {
    name: Array<Scalars["String"]["input"]>;
    userId: Scalars["ID"]["input"];
};

export type DeleteProjectInput = {
    projectId: Scalars["ID"]["input"];
};

export type DeleteResult = {
    __typename?: "DeleteResult";
    affected: Scalars["Int"]["output"];
};

export type DeleteSkillInput = {
    skillId: Scalars["ID"]["input"];
};

export type Department = {
    __typename?: "Department";
    created_at: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
};

export type ExportPdfInput = {
    html: Scalars["String"]["input"];
    margin?: InputMaybe<MarginInput>;
};

export type ForgotPasswordInput = {
    email: Scalars["String"]["input"];
};

export type Language = {
    __typename?: "Language";
    created_at: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    iso2: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    native_name?: Maybe<Scalars["String"]["output"]>;
};

export type LanguageProficiency = {
    __typename?: "LanguageProficiency";
    name: Scalars["String"]["output"];
    proficiency: Proficiency;
};

export type LanguageProficiencyInput = {
    name: Scalars["String"]["input"];
    proficiency: Proficiency;
};

export type Mail = {
    __typename?: "Mail";
    created_at: Scalars["String"]["output"];
    email: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    otp: Scalars["String"]["output"];
};

export type MarginInput = {
    bottom: Scalars["String"]["input"];
    left: Scalars["String"]["input"];
    right: Scalars["String"]["input"];
    top: Scalars["String"]["input"];
};

export enum Mastery {
    Advanced = "Advanced",
    Competent = "Competent",
    Expert = "Expert",
    Novice = "Novice",
    Proficient = "Proficient",
}

export type Mutation = {
    __typename?: "Mutation";
    addCvProject: Cv;
    addCvSkill: Cv;
    addProfileLanguage: Profile;
    addProfileSkill: Profile;
    createCv: Cv;
    createDepartment: Department;
    createLanguage: Language;
    createPosition: Position;
    createProject: Project;
    createSkill: Skill;
    createUser: User;
    deleteAvatar?: Maybe<Scalars["Void"]["output"]>;
    deleteCv: DeleteResult;
    deleteCvSkill: Cv;
    deleteDepartment: DeleteResult;
    deleteLanguage: DeleteResult;
    deletePosition: DeleteResult;
    deleteProfileLanguage: Profile;
    deleteProfileSkill: Profile;
    deleteProject: DeleteResult;
    deleteSkill: DeleteResult;
    deleteUser: DeleteResult;
    exportPdf: Scalars["String"]["output"];
    forgotPassword?: Maybe<Scalars["Void"]["output"]>;
    removeCvProject: Cv;
    resetPassword?: Maybe<Scalars["Void"]["output"]>;
    signup: AuthResult;
    updateCv: Cv;
    updateCvProject: Cv;
    updateCvSkill: Cv;
    updateDepartment: Department;
    updateLanguage: Language;
    updatePosition: Position;
    updateProfile: Profile;
    updateProfileLanguage: Profile;
    updateProfileSkill: Profile;
    updateProject: Project;
    updateSkill: Skill;
    updateToken: UpdateTokenResult;
    updateUser: User;
    uploadAvatar: Scalars["String"]["output"];
    verifyMail?: Maybe<Scalars["Void"]["output"]>;
};

export type MutationAddCvProjectArgs = {
    project: AddCvProjectInput;
};

export type MutationAddCvSkillArgs = {
    skill: AddCvSkillInput;
};

export type MutationAddProfileLanguageArgs = {
    language: AddProfileLanguageInput;
};

export type MutationAddProfileSkillArgs = {
    skill: AddProfileSkillInput;
};

export type MutationCreateCvArgs = {
    cv: CreateCvInput;
};

export type MutationCreateDepartmentArgs = {
    department: CreateDepartmentInput;
};

export type MutationCreateLanguageArgs = {
    language: CreateLanguageInput;
};

export type MutationCreatePositionArgs = {
    position: CreatePositionInput;
};

export type MutationCreateProjectArgs = {
    project: CreateProjectInput;
};

export type MutationCreateSkillArgs = {
    skill: CreateSkillInput;
};

export type MutationCreateUserArgs = {
    user: CreateUserInput;
};

export type MutationDeleteAvatarArgs = {
    avatar: DeleteAvatarInput;
};

export type MutationDeleteCvArgs = {
    cv: DeleteCvInput;
};

export type MutationDeleteCvSkillArgs = {
    skill: DeleteCvSkillInput;
};

export type MutationDeleteDepartmentArgs = {
    department: DeleteDepartmentInput;
};

export type MutationDeleteLanguageArgs = {
    language: DeleteLanguageInput;
};

export type MutationDeletePositionArgs = {
    position: DeletePositionInput;
};

export type MutationDeleteProfileLanguageArgs = {
    language: DeleteProfileLanguageInput;
};

export type MutationDeleteProfileSkillArgs = {
    skill: DeleteProfileSkillInput;
};

export type MutationDeleteProjectArgs = {
    project: DeleteProjectInput;
};

export type MutationDeleteSkillArgs = {
    skill: DeleteSkillInput;
};

export type MutationDeleteUserArgs = {
    userId: Scalars["ID"]["input"];
};

export type MutationExportPdfArgs = {
    pdf: ExportPdfInput;
};

export type MutationForgotPasswordArgs = {
    auth: ForgotPasswordInput;
};

export type MutationRemoveCvProjectArgs = {
    project: RemoveCvProjectInput;
};

export type MutationResetPasswordArgs = {
    auth: ResetPasswordInput;
};

export type MutationSignupArgs = {
    auth: AuthInput;
};

export type MutationUpdateCvArgs = {
    cv: UpdateCvInput;
};

export type MutationUpdateCvProjectArgs = {
    project: UpdateCvProjectInput;
};

export type MutationUpdateCvSkillArgs = {
    skill: UpdateCvSkillInput;
};

export type MutationUpdateDepartmentArgs = {
    department: UpdateDepartmentInput;
};

export type MutationUpdateLanguageArgs = {
    language: UpdateLanguageInput;
};

export type MutationUpdatePositionArgs = {
    position: UpdatePositionInput;
};

export type MutationUpdateProfileArgs = {
    profile: UpdateProfileInput;
};

export type MutationUpdateProfileLanguageArgs = {
    language: UpdateProfileLanguageInput;
};

export type MutationUpdateProfileSkillArgs = {
    skill: UpdateProfileSkillInput;
};

export type MutationUpdateProjectArgs = {
    project: UpdateProjectInput;
};

export type MutationUpdateSkillArgs = {
    skill: UpdateSkillInput;
};

export type MutationUpdateUserArgs = {
    user: UpdateUserInput;
};

export type MutationUploadAvatarArgs = {
    avatar: UploadAvatarInput;
};

export type MutationVerifyMailArgs = {
    mail: VerifyMailInput;
};

export type Position = {
    __typename?: "Position";
    created_at: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
};

export enum Proficiency {
    A1 = "A1",
    A2 = "A2",
    B1 = "B1",
    B2 = "B2",
    C1 = "C1",
    C2 = "C2",
    Native = "Native",
}

export type Profile = {
    __typename?: "Profile";
    avatar?: Maybe<Scalars["String"]["output"]>;
    created_at: Scalars["String"]["output"];
    first_name?: Maybe<Scalars["String"]["output"]>;
    full_name?: Maybe<Scalars["String"]["output"]>;
    id: Scalars["ID"]["output"];
    languages: Array<LanguageProficiency>;
    last_name?: Maybe<Scalars["String"]["output"]>;
    skills: Array<SkillMastery>;
};

export type Project = {
    __typename?: "Project";
    created_at: Scalars["String"]["output"];
    description: Scalars["String"]["output"];
    domain: Scalars["String"]["output"];
    end_date?: Maybe<Scalars["String"]["output"]>;
    environment: Array<Scalars["String"]["output"]>;
    id: Scalars["ID"]["output"];
    internal_name: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    start_date: Scalars["String"]["output"];
};

export type Query = {
    __typename?: "Query";
    cv: Cv;
    cvs: Array<Cv>;
    departments: Array<Department>;
    languages: Array<Maybe<Language>>;
    login: AuthResult;
    position: Position;
    positions: Array<Position>;
    profile: Profile;
    project: Project;
    projects: Array<Project>;
    skillCategories: Array<SkillCategory>;
    skills: Array<Skill>;
    user: User;
    users: Array<User>;
};

export type QueryCvArgs = {
    cvId: Scalars["ID"]["input"];
};

export type QueryLoginArgs = {
    auth: AuthInput;
};

export type QueryPositionArgs = {
    id: Scalars["ID"]["input"];
};

export type QueryProfileArgs = {
    userId: Scalars["ID"]["input"];
};

export type QueryProjectArgs = {
    projectId: Scalars["ID"]["input"];
};

export type QueryUserArgs = {
    userId: Scalars["ID"]["input"];
};

export type RemoveCvProjectInput = {
    cvId: Scalars["ID"]["input"];
    projectId: Scalars["ID"]["input"];
};

export type ResetPasswordInput = {
    newPassword: Scalars["String"]["input"];
};

export type Skill = {
    __typename?: "Skill";
    category?: Maybe<SkillCategory>;
    category_name?: Maybe<Scalars["String"]["output"]>;
    category_parent_name?: Maybe<Scalars["String"]["output"]>;
    created_at: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
};

export type SkillCategory = {
    __typename?: "SkillCategory";
    children: Array<SkillCategory>;
    id: Scalars["ID"]["output"];
    name: Scalars["String"]["output"];
    order: Scalars["Int"]["output"];
    parent?: Maybe<SkillCategory>;
};

export type SkillMastery = {
    __typename?: "SkillMastery";
    categoryId?: Maybe<Scalars["ID"]["output"]>;
    mastery: Mastery;
    name: Scalars["String"]["output"];
};

export type SkillMasteryInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    mastery: Mastery;
    name: Scalars["String"]["input"];
};

export type UpdateCvInput = {
    cvId: Scalars["ID"]["input"];
    description: Scalars["String"]["input"];
    education?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type UpdateCvProjectInput = {
    cvId: Scalars["ID"]["input"];
    end_date?: InputMaybe<Scalars["String"]["input"]>;
    projectId: Scalars["ID"]["input"];
    responsibilities: Array<Scalars["String"]["input"]>;
    roles: Array<Scalars["String"]["input"]>;
    start_date: Scalars["String"]["input"];
};

export type UpdateCvSkillInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    cvId: Scalars["ID"]["input"];
    mastery: Mastery;
    name: Scalars["String"]["input"];
};

export type UpdateDepartmentInput = {
    departmentId: Scalars["ID"]["input"];
    name: Scalars["String"]["input"];
};

export type UpdateLanguageInput = {
    iso2: Scalars["String"]["input"];
    languageId: Scalars["ID"]["input"];
    name: Scalars["String"]["input"];
    native_name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdatePositionInput = {
    name: Scalars["String"]["input"];
    positionId: Scalars["ID"]["input"];
};

export type UpdateProfileInput = {
    first_name?: InputMaybe<Scalars["String"]["input"]>;
    last_name?: InputMaybe<Scalars["String"]["input"]>;
    userId: Scalars["ID"]["input"];
};

export type UpdateProfileLanguageInput = {
    name: Scalars["String"]["input"];
    proficiency: Proficiency;
    userId: Scalars["ID"]["input"];
};

export type UpdateProfileSkillInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    mastery: Mastery;
    name: Scalars["String"]["input"];
    userId: Scalars["ID"]["input"];
};

export type UpdateProjectInput = {
    description: Scalars["String"]["input"];
    domain: Scalars["String"]["input"];
    end_date?: InputMaybe<Scalars["String"]["input"]>;
    environment: Array<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    projectId: Scalars["ID"]["input"];
    start_date: Scalars["String"]["input"];
};

export type UpdateSkillInput = {
    categoryId?: InputMaybe<Scalars["ID"]["input"]>;
    name: Scalars["String"]["input"];
    skillId: Scalars["ID"]["input"];
};

export type UpdateTokenResult = {
    __typename?: "UpdateTokenResult";
    access_token: Scalars["String"]["output"];
    refresh_token: Scalars["String"]["output"];
};

export type UpdateUserInput = {
    cvsIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
    departmentId?: InputMaybe<Scalars["ID"]["input"]>;
    positionId?: InputMaybe<Scalars["ID"]["input"]>;
    role?: InputMaybe<UserRole>;
    userId: Scalars["ID"]["input"];
};

export type UploadAvatarInput = {
    base64: Scalars["String"]["input"];
    size: Scalars["Int"]["input"];
    type: Scalars["String"]["input"];
    userId: Scalars["ID"]["input"];
};

export type User = {
    __typename?: "User";
    created_at: Scalars["String"]["output"];
    cvs?: Maybe<Array<Cv>>;
    department?: Maybe<Department>;
    department_name?: Maybe<Scalars["String"]["output"]>;
    email: Scalars["String"]["output"];
    id: Scalars["ID"]["output"];
    is_verified: Scalars["Boolean"]["output"];
    position?: Maybe<Position>;
    position_name?: Maybe<Scalars["String"]["output"]>;
    profile: Profile;
    role: UserRole;
};

export enum UserRole {
    Admin = "Admin",
    Employee = "Employee",
}

export type VerifyMailInput = {
    otp: Scalars["String"]["input"];
};
