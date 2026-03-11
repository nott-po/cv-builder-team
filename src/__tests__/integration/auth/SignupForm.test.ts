jest.mock("next-intl/routing", () => ({
  defineRouting: jest.fn(() => ({})),
}));
jest.mock("@/i18n/routing", () => ({
  useRouter: jest.fn(() => ({})),
}));

import { getSignupFormSchema } from "@/components/features/auth/SignupForm";

describe("Валидация формы регистрации (Zod Schema)", () => {
  const mockT = (key: string) => `translated_${key}`;
  const schema = getSignupFormSchema(mockT);

  it("должен выдавать ошибку, если email некорректный", () => {
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

  it("должен выдавать ошибку, если пароли НЕ совпадают", () => {
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

  it("должен успешно проходить валидацию с правильными данными", () => {
    const result = schema.safeParse({
      email: "test@example.com",
      password: "SuperSecret123!",
      confirmPassword: "SuperSecret123!",
    });

    expect(result.success).toBe(true);
  });
});
