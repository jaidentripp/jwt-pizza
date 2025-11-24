##**Curiosity Report – AWS Lambda**

**Why I Chose This Topic**

During this course I’ve worked with CI/CD pipelines, automated testing, and cloud-based deployment. AWS Lambda was mentioned a few times, and I decided to dive deeper into how serverless computing actually works internally or how it fits into DevOps and QA. For another class I created a Lambda function that sends emails using SES, and that exercise sparked a lot of questions for me. That curiosity led me to explore Lambda on a deeper level.

**What I Knew Before Research**

Before starting this report, my understanding of Lambda was that it runs code in the cloud without needing a server, you pay for execution time, and other AWS services can trigger the Lambda service. However, I didn’t understand how Lambda is actually ran under the hood, how scaling works, why IAM roles/layers are required, or why cold starts happen. 

**What I Learned Through Research**

AWS Lambda is a serverless compute platform designed for event-driven workloads. A Lambda function is triggered by an event source (API Gateway, S3, SNS, DynamoDB streams, etc.) and AWS automatically provisions the runtime environment, downloads layers and dependencies, executes the handler, and tears down the environment. 
Every Lambda execution uses a micro-VM called a Firecracker VM. When a new VM is created, this is called a cold start. This means that the Lambda must allocate a micro-VM, download the function and layers, initialize the runtime, run initialization code, and run the handler. Cold starts, or the first time the Lambda is ran, explain why first-time execution is slower.
A Lambda function cannot access any AWS services unless specifically granted. For the email Lambda that I created for another class, the Lambda need my “AmazonSESFullAccess” to send the email and the “CloudWatchLogFullAccess” to write the logs from those events. This follows AWS’s security-by-default principle.
I learned that Lambda does not copy dependencies from “node_modules” when packaging compiled TypeScript. Layers are AWS’s solution for sharing dependencies across functions, reducing deployment package size, and isolating version upgrades. 

**My Experiment**

I wrote and deployed a Lambda function that sends SES email messages. Here are the steps I took:
1.	Wrote the Lambda in TypeScript
2.	Ran “npm run build” to compile into JavaScript
3.	Created a ZIP of only the compiled “dist” folder and uploaded it to AWS Lambda
4.	Created a Lambda Layer containing “node_modules”
5.	Created an IAM role granting SES and CloudWatch logging permissions
6.	Linked the layer and role to the Lambda
7.	Sent a test event to trigger SES and verified Email delivery
8.	Confirmed execution and logs through CloudWatch

I learned a lot from this exercise and the behaviors of the Lambda that I observed. The first execution I had of the email Lambda took longer than the later executions. This is because of the cold start – the first execution always takes longer than later ones. I also experimented with the IAM permissions and other layers. I learned that these are very much needed for a Lambda to execute properly, the dependencies that are needed must be packaged correctly, and the IAM permissions only allow what is necessary and nothing more. 

**Conclusion**

Diving deeper into AWS Lambda helped me come to a better understanding of “serverless computing”. I learned that Lambda isn’t just a way to run code without a server — it’s a highly engineered system built on event-driven triggers, strict security boundaries, automatic scaling, and Firecracker micro-VMs that balance performance and cost efficiency. Learning about how AWS Lambda works has made me eager to use it in the future. 

