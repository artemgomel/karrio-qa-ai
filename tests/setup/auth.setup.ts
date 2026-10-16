import { test as setup, expect } from '@playwright/test';
import { SignInPage } from '../../src/pages/sign-in.page';
import { config, AUTH_STATE } from '../../src/config';

/** Log in once through the UI and reuse the session in all UI tests. */
setup('authenticate', async ({ page }) => {
  const signIn = new SignInPage(page);
  await signIn.open();
  await signIn.signIn(config.email, config.password);
  await expect(page).not.toHaveURL(/signin/, { timeout: 30_000 });
  await page.context().storageState({ path: AUTH_STATE });
});
