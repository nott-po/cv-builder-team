jest.mock("next-intl/routing", () => ({
  defineRouting: jest.fn(() => ({})),
}));
jest.mock("@/i18n/routing", () => ({
  useRouter: jest.fn(() => ({})),
}));

import { getSignupFormSchema } from "@/components/features/auth/SignupForm";

describe("Registration Form Validation (Zod Schema)", () => {
  const mockT = (key: string) => `translated_${key}`;
  const schema = getSignupFormSchema(mockT);

  it("should return error if email is invalid", () => {
    const result = schema.safeParse({
      email: "bad-email",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("translated_wrong_email");
    }
  });

  it("should return error if passwords do NOT match", () => {
    const result = schema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "differentPassword!",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("translated_passwords_do_not_match");
      expect(result.error.issues[0].path[0]).toBe("confirmPassword");
    }
  });

  it("should successfully validate with correct data", () => {
    const result = schema.safeParse({
      email: "test@example.com",
      password: "SuperSecret123!",
      confirmPassword: "SuperSecret123!",
    });

    expect(result.success).toBe(true);
  });
});
