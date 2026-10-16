import { test, expect } from '../../src/fixtures';
import { config } from '../../src/config';

test.describe('Sign in', () => {
  // These tests need a clean browser, not the saved session
  test.use({ storageState: { cookies: [], origins: [] } });

  test('user with valid credentials gets to the dashboard @smoke @mobile', async ({ page, signInPage }) => {
    await signInPage.open();
    await signInPage.signIn(config.email, config.password);
    await expect(page).not.toHaveURL(/signin/, { timeout: 30_000 });
  });

  test('wrong password keeps the user on the sign-in page', async ({ page, signInPage }) => {
    await signInPage.open();
    await signInPage.signIn(config.email, 'wrong-password');
    await expect(page).toHaveURL(/signin/);
    await expect(signInPage.submit).toBeVisible();
  });
});
