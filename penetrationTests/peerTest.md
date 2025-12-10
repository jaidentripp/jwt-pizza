# Security Assessment Report

**Authors:** Samuel Soto & Jaiden Tripp  
**Date:** December 9, 2025

---

## 1. Self-Attack (Performed by: Samuel Soto)

### **Attack Details**

- **Date Executed:** 12/09/2025
- **Target Website:** `pizza.justachillguy.click`
- **Attack Type:** Broken Access Control
- **Severity:** **3** (High)

### **Description of Result**

An admin account was compromised by tampering with the admin user’s credentials using Burp Suite Repeater.  
The attacker (myself) was able to:

- Change the administrator’s password
- Log in as the admin with the new credentials
- Escalate authorization to administrator level
- Access sensitive administrative functionality
- Acquire significant internal data
- Cause performance impact due to unauthorized administrative access

This demonstrates a _horizontal and vertical privilege escalation_ vulnerability.

### **Evidence / Screenshots**

![loginHacked](./images/hackedLogin.png)  
![confirmedHack](./images/confirmedHack.png)

### **Corrections Made**

Although the attack was successful, it hinges on one assumption:  
**The attacker must know or obtain the admin’s identifying data (email + current password) to authenticate initially.**

Because I had valid admin credentials for testing, I demonstrated that any leak of admin login details would allow a malicious actor to:

- Log in as the admin
- Submit forged requests altering account information
- Lock out the real admin and take over the system

The vulnerability was fixed by ensuring:

- Users can **only update their own account**
- `roles`, `id`, and other sensitive fields are ignored server-side
- Admin privileges cannot be escalated from the client

---

## 2. Self-Attack (Performed by: Jaiden Tripp)

### **Attack Details**

- **Date Executed:** 12/09/2025  
- **Target Website:** `pizza.jaidentrippdevops2025.click`  
- **Attack Type:** Broken Authentication / Server Misconfiguration  
- **Severity:** **2** (Medium)

### **Description of Result**

During my self-penetration test, I examined the authentication flow of my JWT Pizza deployment — specifically user registration and login. Both flows consistently failed with an HTTP 500 Internal Server Error, indicating a critical backend problem.

Steps performed:

1. Navigated to the Register page.  
2. Entered valid registration values (username, email, password).  
3. Clicked Register.  
4. The UI immediately displayed the following error message:  
   ‘{"code":500,"message":"Failed to fetch"}’  
5. Chrome DevTools confirmed the request was sent, but the backend responded with a 500 error before completing the operation.  
6. Repeating the same process on the Login page produced the same error.

**Impact of the vulnerability:**  
A server-side failure on authentication endpoints prevents any new users from being created and blocks existing users from logging in. This undermines the core functionality of the application and demonstrates:

- Missing backend error handling  
- Possible invalid database configuration or credential issues  
- Potentially unsafe exception exposure to the client  
- Lack of graceful fallback or validation responses  

Although this attack does not compromise data, the ability for any user to repeatedly trigger 500 errors can degrade system stability and reveal sensitive details about backend failures.

### **Evidence / Screenshots**

Below is the screenshot captured during the attack:

- The login form showing the {"code":500,"message":"Failed to fetch"} error after attempting to login  
- The failed network request visible in Chrome DevTools  

<img width="468" height="256" alt="image" src="https://github.com/user-attachments/assets/ea4ec279-a91f-43ab-aaab-7f4f4a27c870" />

### **Corrections Made**

To fix this vulnerability, I updated the server to properly handle registration and login failures:

- Ensured DynamoDB and authentication service clients initialize correctly  
- Added proper try/catch blocks to prevent uncaught exceptions  
- Returned structured error messages instead of raw 500 responses  
- Validated that the authentication endpoint URL and environment variables were correct  
- Verified IAM roles and permissions for reading/writing user data

After applying these fixes, registration and login requests now return proper success responses or readable validation errors rather than a server-crashing 500. 

---

## 3. Attack on Jaiden Tripp

### **Attack Details**

- **Date Executed:** 12/09/2025
- **Target Website:** `pizza.justachillguy.click`
- **Attack Type:**
- **Severity:**
- **Description of Result:**
- **Evidence / Screenshots:**  
  _(Insert images here if applicable)_
- **Corrections Made (if successful):**

---

## 4. Attack on Samuel Soto (Performed by: Jaiden Tripp)

### **Attack Details**

- **Date Executed:** 12/09/2025  
- **Target Website:** `pizza.justachillguy.click`  
- **Attack Type:** Broken Access Control / Server Misconfiguration / Input Handling Failure  
- **Severity:** **2** (Medium)

### **Description of Result**

While testing the functionality of the payment workflow on Samuel’s deployment, I discovered that the “Pay now” button consistently triggers a server-side failure that results in an HTTP 500 Internal Server Error.

Steps performed:

1. Registered and logged in as a standard customer account.  
2. Added multiple pizzaa to the cart and moved to the payment page.  
3. Clicked “Pay now.”  
4. Observed that the UI displayed an error banner:  
   “Failed to fulfill order at factory.”
5. In Chrome DevTools (Network tab), the ‘order’ request returned a 500 error, indicating that the backend attempted to process the order but failed due to improper server handling.

This vulnerability shows that:

- The backend does not properly validate or sanitize the order request
- The server-side order fulfillment logic is either misconfigured or unprotected
- A regular user can repeatedly trigger internal server errors, which may reveal system weaknesses, generate excessive logs, or degrade performance.

Although this attack did not expose sensitive data or modify system state, it demonstrates a reliability and security weakness that an attacker could exploit to:

- Spam 500-error requests  
- Cause performance degradation  
- Discover internal API behavior  
- Potentially escalate to more serious attacks such as injection

### **Evidence / Screenshots**

Below is a screenshot captured during the attack:

- Screenshot of payment page showing the error banner  
- Network tab showing the failing ‘order’ request returning HTTP 500 
- Console output displaying:  
  “Failed to load resource: the server responded with a status of 500 (order:1)"

  <img width="468" height="254" alt="image" src="https://github.com/user-attachments/assets/8f508495-6532-4af5-ba72-142b14b62d28" />

### **Corrections Suggested**

To fix this issue, I recommend the following:

- Make sure the backend order-processing endpoint includes full input validation, required fields, and expected data types.  
- Add proper error handling so that internal server details are never exposed to the UI.  
- Implement a try/catch around factory fulfillment calls with descriptive but secure error responses.  
- Monitor logs for repeated failed payment attempts, which may indicate probing or abuse.

Once corrected, the “Pay now” request should return a meaningful error such as 400 Bad Request or 403 Forbidden, instead of a server-crashing 500 Internal Server Error.
