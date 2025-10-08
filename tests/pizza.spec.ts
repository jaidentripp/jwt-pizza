import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { Role, User } from '../src/service/pizzaService';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

// test('purchase with login', async ({ page }) => {await page.goto('http://localhost:3000/');
// await page.getByRole('link', { name: 'Login' }).click();
// await page.getByRole('textbox', { name: 'Email address' }).click();
// await page.getByRole('textbox', { name: 'Email address' }).fill('abc@abc.com');
// await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
// await page.getByRole('textbox', { name: 'Password' }).click();
// await page.getByRole('textbox', { name: 'Password' }).fill('abc');
// await page.getByRole('button', { name: 'Login' }).click();

// test('purchase with login', async ({ page }) => {
//     await page.goto('/');
//     await page.getByRole('button', { name: 'Order now' }).click();
//     await expect(page.locator('h2')).toContainText('Awesome is a click away');
//     await page.getByRole('combobox').selectOption('6');
//     await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
//     await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
//     await expect(page.locator('form')).toContainText('Selected pizzas: 2');
//     await page.getByRole('button', { name: 'Checkout' }).click();
//     await page.getByPlaceholder('Email address').click();
//     await page.getByPlaceholder('Email address').fill('d@jwt.com');
//     await page.getByPlaceholder('Email address').press('Tab');
//     await page.getByPlaceholder('Password').fill('diner');
//     await page.getByRole('button', { name: 'Login' }).click();
//     await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
//     await expect(page.locator('tbody')).toContainText('Veggie');
//     await page.getByRole('button', { name: 'Pay now' }).click();
//     await expect(page.getByRole('main')).toContainText('0.008 ₿');
//   });



// test('admin login', async ({ page }) => {
// await page.getByRole('link', { name: 'Login' }).click();
// await page.getByRole('textbox', { name: 'Email address' }).click();
// await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
// await page.getByRole('textbox', { name: 'Password' }).click();
// await page.getByRole('textbox', { name: 'Password' }).fill('admin');
// await page.getByRole('button', { name: 'Login' }).click();
// await expect(page.locator('#navbar-dark')).toContainText('Admin');
// await page.getByRole('link', { name: '常' }).click();
// await expect(page.getByText('Your pizza kitchen')).toBeVisible();});

test('admin dash', async ({page}) => {await page.goto('http://localhost:5174/');

await page.goto('http://localhost:5174/');
await page.getByRole('link', { name: 'Login' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
await page.getByRole('textbox', { name: 'Password' }).press('Enter');
await page.getByRole('button', { name: 'Login' }).click();

});

// let franchises = [
//     { id: 2, name: 'LotaPizza', stores: [ { id: 4, name: 'Lehi' }, { id: 5, name: 'Springville' }, { id: 6, name: 'American Fork' } ] },
//      { id: 3, name: 'PizzaCorp', stores: [ { id: 7, name: 'Spanish Fork' } ] },
//      { id: 4, name: 'topSpot', stores: [] }
// ]


async function basicInit(page: Page) {
    let loggedInUser: User | undefined;
    const validUsers: Record<string, User> = { 
        'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] },
        'f@jwt.com': { id: '10', name: 'Fran Owner', email: 'f@jwt.com', password: 'franchisee', roles: [{ role: Role.Franchisee }] }, 
        'a@jwt.com': { id: '1', name: '常', email: 'a@jwt.com', password: 'admin', roles: [{ role: Role.Admin }] },};

//         // Mutable franchises array
  const franchises: { id: number; name: string; stores: { id: number; name: string }[] }[] = [
    { id: 2, name: 'LotaPizza', stores: [ { id: 4, name: 'Lehi' }, { id: 5, name: 'Springville' }, { id: 6, name: 'American Fork' } ] },
    { id: 3, name: 'PizzaCorp', stores: [ { id: 7, name: 'Spanish Fork' } ] },
    { id: 4, name: 'topSpot', stores: [] },
  ];

    //Authorize login for the given user
    await page.route('*/**/api/auth', async (route) => {
      const loginReq = route.request().postDataJSON() || {};
      const user = validUsers[loginReq.email];

      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
        return;
      }
    
      loggedInUser = user;
    
      const loginRes = { user: loggedInUser, token: 'abcdef' };
    
      // Accept POST or PUT
      const method = route.request().method();
      expect(['POST', 'PUT']).toContain(method);
    
      await route.fulfill({ json: loginRes });
    });



  
    //Return the currently logged in user
    await page.route('*/**/api/user/me', async (route) => {
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: loggedInUser });
    });
    // await page.route('*/**/api/user/me', async (route) => {
    //     expect(route.request().method()).toBe('GET');
    //     if (loggedInUser) {
    //       await route.fulfill({ json: loggedInUser });
    //     } else {
    //       await route.fulfill({ status: 401, json: { error: 'Not logged in' } });
    //     }
    //   });

  
    // A standard menu
    await page.route('*/**/api/order/menu', async (route) => {
      const menuRes = [
        {
          id: 1,
          title: 'Veggie',
          image: 'pizza1.png',
          price: 0.0038,
          description: 'A garden of delight',
        },
        {
          id: 2,
          title: 'Pepperoni',
          image: 'pizza2.png',
          price: 0.0042,
          description: 'Spicy treat',
        },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: menuRes });
    });
  
    // Standard franchises and stores
    // await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    //   const franchiseRes = {
    //     franchises: [
    //       {
    //         id: 2,
    //         name: 'LotaPizza',
    //         stores: [
    //           { id: 4, name: 'Lehi' },
    //           { id: 5, name: 'Springville' },
    //           { id: 6, name: 'American Fork' },
    //         ],
    //       },
    //       { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
    //       { id: 4, name: 'topSpot', stores: [] },
    //     ],
    //   };
    //   expect(route.request().method()).toBe('GET');
    //   await route.fulfill({ json: franchiseRes });
    // });

    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({ json: { franchises } });
        } else if (route.request().method() === 'POST') {
          const req = route.request().postDataJSON();
          const newFranchise = { id: franchises.length + 1, name: req.name, stores: [] };
          franchises.push(newFranchise);
          await route.fulfill({ status: 201, json: newFranchise });
        } else {
          await route.continue();
        }
      });
    
  
    // Order a pizza. (post)
    await page.route('*/**/api/order', async (route) => {
      const orderReq = route.request().postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: orderRes });
    });

    // Fetch existing orders (get)
    await page.route('*/**/api/order', async (route) => {
        if (route.request().method() === 'GET') {
          const ordersRes = {
            orders: [
              {
                id: 23,
                customer: 'Kai Chen',
                pizzas: ['Veggie', 'Pepperoni'],
                total: 0.008,
                status: 'Completed',
              },
            ],
          };
          await route.fulfill({ json: ordersRes });
        } else {
          await route.continue();
        }
      });

    // admin page
    // await page.route('*/**/api/admin/me', async (route) => {
    //     expect(route.request().method()).toBe('GET');
    //     if (loggedInUser?.roles?.some((r) => r.role === Role.Admin)) {
    //         await route.fulfill({
    //         json: {
    //             kitchen: {
    //             id: 99,
    //             name: "Your pizza kitchen",
    //             staff: [
    //                 { id: 1, name: 'Chef Mike' },
    //                 { id: 2, name: 'Sous Maria' },
    //             ],
    //             },
    //         },
    //         });
    //     } else {
    //         await route.fulfill({ status: 403, json: { error: 'Forbidden' } });
    //     }
    // });


    await page.route('*/**/api/admin/me', async (route) => {
        const user = loggedInUser;
        if (user?.roles?.some(r => r.role === Role.Admin)) {
          await route.fulfill({
            json: {
              kitchen: {
                id: 99,
                name: "Your pizza kitchen",
              },
            },
          });
        } else {
          await route.fulfill({ status: 403, json: { error: 'Forbidden' } });
        }
      });


    //   await page.route('*/**/api/auth', async (route) => {
    //     const loginReq = route.request().postDataJSON();
    //     const user = validUsers[loginReq.email];
    //     if (!user || user.password !== loginReq.password) {
    //       await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
    //       return;
    //     }
    //     loggedInUser = user;
    //     await route.fulfill({ json: { user: loggedInUser, token: 'abcdef' } });
    //   });

    const registeredUsers: Record<string, User> = {};

    // Registration route
    await page.route('*/**/api/user/register', async (route) => {
    const req = route.request().postDataJSON();
    if (!req.name || !req.email || !req.password) {
        await route.fulfill({ status: 400, json: { error: 'Missing fields' } });
        return;
    }
    if (registeredUsers[req.email]) {
        await route.fulfill({ status: 409, json: { error: 'User already exists' } });
        return;
    }

    const newUser: User = {
        id: (Object.keys(validUsers).length + 1).toString(),
        name: req.name,
        email: req.email,
        password: req.password,
        roles: [{ role: Role.Diner }],
    };

    validUsers[req.email] = newUser;
    //registeredUsers[req.email] = newUser;

    //await route.fulfill({ status: 201, json: newUser });
    loggedInUser = newUser;

    await route.fulfill({
        status: 201,
        json: { user: newUser, token: 'abcdef' },
    });

    });

    await page.goto('/');
  }
  
  test('diner login', async ({ page }) => {
    await basicInit(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();

    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();

    // Clear loggedInUser in test (if not already done by route)
    // loggedInUser = undefined;

    await expect(page.locator('#navbar-dark')).toContainText('Login');
  });
  
  test('purchase with diner login', async ({ page }) => {
    await basicInit(page);
  
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();
  
    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();
  
    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();
  
    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');
  });

  test('franchise login and dashboard', async ({ page }) => {
    await basicInit(page);
  
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
    await expect(page.getByRole('main')).toContainText('Unleash Your Potential');
  
    await page.getByRole('link', { name: 'login', exact: true }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();

    //await page.getByRole('link', { name: 'FO' }).click();
    //await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
    //await expect(page.getByRole('main')).toContainText('Fran Owner');
  
    //await expect(page.locator('#navbar-dark')).toContainText('Franchise');
    //await expect(page.getByRole('list')).toContainText('franchise-dashboard');
    //await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
    

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');
  });

  test('admin login', async ({ page }) => {
    await basicInit(page);
  
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
  
    await expect(page.locator('#navbar-dark')).toContainText('Admin');
    await page.getByRole('link', { name: '常' }).click();
    //await expect(page.getByText('Your pizza kitchen')).toBeVisible();

    //await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
    //await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
    //await expect(page.locator('span')).toContainText('Your pizza kitchen');

    // Logout
    //await page.getByRole('link', { name: 'Logout' }).click();
    //await expect(page.locator('#navbar-dark')).toContainText('Login');
  });

test('admin create franchise', async ({ page }) => {
    await basicInit(page);

    // Login as admin
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    // Navigate to admin dashboard
     await page.getByRole('link', { name: 'Admin' }).click();
  
     // Assert admin dashboard content
     await expect(page.locator('h2')).toContainText("Mama Ricci's kitchen");
     await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
     await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();

     // Click Add Franchise and fill form
     await page.getByRole('button', { name: 'Add Franchise' }).click();
    
     await page.getByRole('textbox', { name: 'franchise name' }).click();
     await page.getByRole('textbox', { name: 'franchise name' }).fill('TestFranchise');
     await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
     await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');

     await page.getByRole('button', { name: 'Create' }).click();

     // Logout
     await page.getByRole('link', { name: 'Logout' }).click();
     await expect(page.locator('#navbar-dark')).toContainText('Login');

     //NEED TO CHECK TABLE ON ADMIN DASH
})
  
//   test('admin dashboard and create franchise', async ({ page }) => {
//     await basicInit(page);
  
//     // Login as admin
//     await page.getByRole('link', { name: 'Login' }).click();
//     await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
//     await page.getByRole('textbox', { name: 'Password' }).fill('admin');
//     await page.getByRole('button', { name: 'Login' }).click();
  
//     // Navigate to admin dashboard
//     await page.getByRole('link', { name: 'Admin' }).click();
  
//     // Assert admin dashboard content
//     await expect(page.locator('h2')).toContainText("Mama Ricci's kitchen");
//     await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
//     await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();

//     // Click Add Franchise and fill form
//     await page.getByRole('button', { name: 'Add Franchise' }).click();
    
//     await page.getByRole('textbox', { name: 'franchise name' }).click();
//     await page.getByRole('textbox', { name: 'franchise name' }).fill('TestFranchise');
//     await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
//     await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');

//     //await page.getByPlaceholder('Franchise name').fill('TestFranchise');
//     await page.getByRole('button', { name: 'Create' }).click();

//     // Assert new franchise shows in the list
//     //await expect(page.getByRole('heading', { name: 'TestFranchise' })).toBeVisible();
//     //await expect(page.locator('td')).toContainText('TestFranchise');
//     //await expect(page.getByText('TestFranchise')).toBeVisible();
//     await expect(page.getByRole('cell', { name: 'TestFranchise', exact: true })).toBeVisible();

//     // Logout to clean state
//     await page.getByRole('link', { name: 'Logout' }).click();
//     await expect(page.locator('#navbar-dark')).toContainText('Login');
//   });

test('close franchise', async ({ page }) => {
    await basicInit(page);
  
    // Login as admin
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Navigate to admin dashboard
    await page.getByRole('link', { name: 'Admin' }).click();
  
    // Assert admin dashboard content
    await expect(page.locator('h2')).toContainText("Mama Ricci's kitchen");
    await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();

    // Click close franchise
    await page.getByRole('row', { name: 'topSpot Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await expect(page.getByRole('list')).toContainText('close-franchise');
    await page.getByRole('button', { name: 'Close' }).click();

    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');

    //NEED TO CONFIRM IN TABLE
});

test('close store', async ({ page }) => {
    await basicInit(page);

    // Login as admin
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
  
    // Navigate to admin dashboard
    await page.getByRole('link', { name: 'Admin' }).click();
  
    // Assert admin dashboard content
    await expect(page.locator('h2')).toContainText("Mama Ricci's kitchen");
    await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();

    // Close store
    await page.getByRole('row', { name: 'American Fork ₿ Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await expect(page.getByRole('main')).toContainText('American Fork');
    await page.getByRole('button', { name: 'Close' }).click();

    // Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#navbar-dark')).toContainText('Login');

    //NEED TO CONFIRM IN TABLE

});

test('register a new diner', async ({ page }) => {
    await basicInit(page);
  
    // Navigate to register page
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
  
    await expect(page.getByRole('list')).toContainText('register');
  
    // Fill out the registration form
    await page.getByRole('textbox', { name: 'Full name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Email address' }).fill('test@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('test');
  
    // Submit registration
    await page.getByRole('button', { name: 'Register' }).click();

    //NEED TO FIGURE OUT HOW TO REROUTE TO HOME PAGE AND HAVE NEW REGISTER LOGGED IN
  
    // Confirm redirected to homepage
    //await expect(page.getByRole('heading')).toContainText("The web's best pizza");
  
    // Confirm user name appears in navbar
    //await expect(page.getByRole('link', { name: 'T', exact: true })).toBeVisible();
    //await page.getByRole('link', { name: 'T', exact: true }).click();
  
    // Confirm main page shows user info
    //await expect(page.getByRole('main')).toContainText('Test');
    //await expect(page.getByRole('main')).toContainText('diner');
  });

  test('history page', async ({ page }) => {
    await basicInit(page);

    await expect(page.getByRole('contentinfo')).toContainText('History');
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByRole('list')).toContainText('history');
    await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
    await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  });

  test('about page', async ({ page }) => {
    await basicInit(page);

    await expect(page.getByRole('contentinfo')).toContainText('About');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByRole('list')).toContainText('about');
    await expect(page.getByRole('main')).toContainText('The secret sauce');
    await expect(page.getByRole('main')).toContainText('Our employees');
    await expect(page.getByRole('main').getByRole('img').first()).toBeVisible();
    
    //await expect(page.getByRole('heading')).toContainText('The secret sauce');
    //await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  });

  test ('not found page', async ({ page }) => {
    await basicInit(page);

    // Navigate to not found page
    await page.goto('/not-found');

    await expect(page.getByRole('list')).toContainText('not-found');
    await expect(page.getByRole('heading')).toContainText('Oops');
    await expect(page.getByRole('main')).toContainText('It looks like we have dropped a pizza on the floor. Please try another page.');
  })
  