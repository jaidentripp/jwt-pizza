# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |      home.jsx      |       none        |     none     |
| Register new user<br/>(t@jwt.com, pw: test)         |  register.jsx      | [POST]/api/auth   | INSERT INTO user (name, email, password) VALUES (?, ?, ?)     INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Login new user<br/>(t@jwt.com, pw: test)            |  login.jsx         | [PUT]/api/auth    | INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token |
| Order pizza                                         |  menu.jsx          | [POST]/api/order  | INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())     INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?) |
| Verify pizza                                        | delivery.jsx       | [GET]/api/order   | SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? SELECT id, menuId, description, price FROM orderItem WHERE orderId=? |
| View profile page                                   | dineDashboard.jsx  | [GET]/api/auth/me | SELECT * FROM user WHERE email= SELECT * FROM userRole WHERE userId=? |
| View franchise<br/>(as diner)                       | franchiseDashboard.jsx| [GET]/api/franchise/:userId | SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?     SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')}) |
| Logout                                              |  logout.jsx        | [DELETE]/api/auth | DELETE FROM auth WHERE token=? |
| View About page                                     |  about.jsx         |      none         |   none       |
| View History page                                   |  history.jsx       |      none         |   none       |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |  login.jsx         | [PUT]/api/auth    | INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token  |
| View franchise<br/>(as franchisee)                  |franchiseDashboard.jsx|  none           |   none       |
| Create a store                                      | createStore.jsx    | [POST]/api/franchise/:franchiseId/store | INSERT INTO store (franchiseId, name) VALUES (?, ?) |
| Close a store                                       | closeStore.jsx     | [DELETE]/api/franchise/:franchiseId/store/:storeId | DELETE FROM store WHERE franchiseId=? AND id=? |
| Login as admin<br/>(a@jwt.com, pw: admin)           |  login.jsx         | [PUT]/api/auth    | INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token |
| View Admin page                                     | adminDashboard.jsx |     none          |    none      |
| Create a franchise for t@jwt.com                    | createFranchise.jsx|[POST]/api/franchise| SELECT id, name FROM user WHERE email=?  INSERT INTO franchise (name) VALUES (?) |
| Close the franchise for t@jwt.com                   | closeFranchise.jsx |[DELETE]/api/franchise/:franchiseId| DELETE FROM store WHERE franchiseId=?     DELETE FROM userRole WHERE objectId=?      DELETE FROM franchise WHERE id=?|
