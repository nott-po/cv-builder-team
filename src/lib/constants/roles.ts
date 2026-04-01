import { UserRole } from "@/generated/graphql";

export { UserRole };

export const ROLE_HOME: Record<UserRole, string> = {
    [UserRole.Admin]: "/admin/employees",
    [UserRole.Employee]: "/employees",
};
