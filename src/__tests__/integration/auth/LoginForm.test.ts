jest.mock("next-intl");
jest.mock("next-intl/routing", () => ({
  defineRouting: jest.fn(() => ({})),
}));
jest.mock("@/i18n/routing", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

import { getLoginFormSchema } from "@/components/features/auth/LoginForm";

describe("Login Form Validation (Zod Schema)", () => {

  const mockT = (key: string) => `translated_${key}`;

  const schema = getLoginFormSchema(mockT);

  it("should return an error if email is missing @", () => {
    const result = schema.safeParse({
      email: "not-an-email",
      password: "validPassword123"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("translated_wrong_email");
    }
  });

  it("should return an error if password is shorter than 6 characters", () => {
    const result = schema.safeParse({
      email: "test@example.com",
      password: "123"
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("translated_wrong_password");
    }
  });

  it("should successfully validate correct data", () => {
    const result = schema.safeParse({
      email: "test@example.com",
      password: "SuperSecretPassword123!"
    });

    expect(result.success).toBe(true);
  });
});
