import { Page, Locator } from '@playwright/test';

export class SignInPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page) {
    // Karrio sign-in form uses name attributes (same as the official karrio e2e package)
    this.email = page.locator('input[name="email"]');
    this.password = page.locator('input[name="password"]');
    this.submit = page.getByRole('button', { name: /sign in/i });
  }

  async open(): Promise<void> {
    await this.page.goto('/signin');
    await this.email.waitFor();
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
