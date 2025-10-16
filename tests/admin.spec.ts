import { test, expect } from 'playwright-test-coverage';

test('admin can see list of users', async ({ page }) => {
    await page.route('**/api/user*', async (route) => {
        const mockUsers = {
          users: [
            {
              id: 1,
              name: 'Alice Admin',
              email: 'a@jwt.com',
              roles: [{ role: 'Admin' }],
            },
            {
              id: 2,
              name: 'Bob Franchisee',
              email: 'bob@jwt.com',
              roles: [{ role: 'FranchiseOwner' }],
            },
            {
              id: 3,
              name: 'Charlie Diner',
              email: 'charlie@jwt.com',
              roles: [{ role: 'Diner' }],
            },
          ],
          more: false,
        };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsers),
        });
      });

await page.route('**/api/user/*', async (route) => {
         await route.fulfill({ status: 200, json: { success: true } });
       });

  // Login as admin
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();

  await expect(page.getByRole('main')).toContainText('Users');
  await expect(page.getByRole('main')).toContainText('Name');
  await expect(page.getByRole('main')).toContainText('Email');
  await expect(page.getByRole('main')).toContainText('Roles');
  await expect(page.getByRole('main')).toContainText('Action');
  await expect(page.getByRole('main')).toContainText('Filter');
  await expect(page.getByRole('main')).toContainText('Delete');


  await expect(page.getByRole('main')).toContainText('Alice Admin');
  await expect(page.getByRole('main')).toContainText('Bob Franchisee');
  await expect(page.getByRole('main')).toContainText('Charlie Diner');

  await page.getByRole('button', { name: 'Delete' }).nth(2).click(); // assuming he's the 3rd user
  await expect(page.getByRole('main')).not.toContainText('Charlie Diner');

  await page.getByRole('textbox', { name: 'Filter by name' }).fill('abc');
  await page.getByRole('button', { name: 'Filter' }).click();
});
