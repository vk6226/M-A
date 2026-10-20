# Comprehensive AWS Cloud Hosting & Architecture Guide
## AURA M&A™ Precision Target Discovery and Deal Intelligence Platform

This document is your master reference manual for understanding and deploying the **AURA M&A Intelligence Platform** onto Amazon Web Services (AWS). Whether you prefer deploying through the **AWS Management Console (GUI)**, automated **AWS CLI scripts**, **AWS Amplify**, or **Docker on AWS App Runner**, this guide breaks down every concept, architectural decision, and step-by-step procedure.

---

## Table of Contents
1. [Core Conceptual Understanding: How the Cloud Architecture Works](#1-core-conceptual-understanding)
2. [Prerequisites & Initial Setup](#2-prerequisites--initial-setup)
3. [Method 1 (Recommended): AWS S3 + CloudFront Global CDN](#3-method-1-recommended-aws-s3--cloudfront-global-cdn)
   - [Automated 1-Click Script](#31-automated-1-click-script)
   - [AWS Management Console (GUI) Walkthrough](#32-aws-management-console-gui-walkthrough)
   - [Manual AWS CLI Step-by-Step](#33-manual-aws-cli-step-by-step)
4. [Method 2: AWS Amplify Hosting (Automated Git CI/CD)](#4-method-2-aws-amplify-hosting)
5. [Method 3: Dockerized Container on AWS App Runner / ECS](#5-method-3-dockerized-container-on-aws-app-runner--ecs)
6. [Configuring a Custom Domain & Free SSL (Route 53 & ACM)](#6-configuring-a-custom-domain--free-ssl)
7. [Cost Estimation & AWS Free Tier Details](#7-cost-estimation--aws-free-tier-details)
8. [Production Security & Operations Checklist](#8-production-security--operations-checklist)

---

## 1. Core Conceptual Understanding

### What is AURA M&A Platform from a Technical Perspective?
The AURA M&A platform is a modern, high-performance **Single-Page Application (SPA)** written in React and TypeScript, bundled with Vite, and styled with high-performance CSS. 

When you run `npm run build`:
- TypeScript and React components compile down to pure, static web assets: HTML (`index.html`), minified JavaScript (`assets/*.js`), and CSS (`assets/*.css`).
- There is **no need to pay for an expensive 24/7 running virtual machine (like an EC2 instance)** just to serve static files. 
- Instead, the gold standard cloud architecture is **Serverless Static Web Hosting via Amazon S3 and Amazon CloudFront**.

### Key AWS Services Explained Simply:

```
[User Browser]
       │
       ▼ (HTTPS / DNS Query)
[AWS Route 53 (DNS) + AWS Certificate Manager (Free SSL)]
       │
       ▼ (Global Edge Cache - 400+ PoPs)
[Amazon CloudFront CDN]
       │
       ▼ (Origin Access Control - OAC Private Request)
[Amazon S3 Bucket (Private File Storage)]
```

1. **Amazon S3 (Simple Storage Service)**:
   - S3 is an object storage service with 99.999999999% (11 9's) of durability.
   - It acts as the "hard drive" in the cloud where your compiled web files (`index.html`, JavaScript bundles, icons) live.
   - In modern AWS best practices, **S3 buckets are kept completely private** (Block All Public Access = Enabled). Nobody can access the S3 bucket directly.

2. **Amazon CloudFront (Content Delivery Network - CDN)**:
   - CloudFront has over 400 points of presence (PoPs) across the world.
   - When a user in London, New York, or Singapore opens your app, CloudFront serves the cached assets from the data center closest to them in under 20 milliseconds.
   - CloudFront connects to S3 securely using **Origin Access Control (OAC)**, meaning only CloudFront can fetch files from your S3 bucket.
   - CloudFront handles free SSL/TLS HTTPS encryption and compresses assets using Brotli and Gzip.

3. **Origin Access Control (OAC)**:
   - A cryptographic security feature that ensures requests to S3 come strictly through your CloudFront distribution, preventing data scrapers or unauthorized access.

4. **SPA Client-Side Routing**:
   - Because React handles routing on the client side, if a user refreshes their browser at a subpath (e.g., `/pipeline`), S3 would normally throw a `404 Not Found` because no file named `pipeline` exists on disk.
   - CloudFront solves this with **Custom Error Responses**: any `404` or `403` error is automatically rewritten to `/index.html` with an HTTP status `200 OK`, allowing React to render the right view instantly.

---

## 2. Prerequisites & Initial Setup

Before deploying, ensure you have:
1. An **AWS Account** ([Sign up for free at aws.amazon.com](https://aws.amazon.com/free/)).
2. **Node.js 20+** installed locally (you already have Node v24).
3. **AWS CLI** installed and configured:
   ```bash
   # Check if AWS CLI is installed
   aws --version

   # Configure your AWS credentials
   aws configure
   ```
   You will be prompted for:
   - **AWS Access Key ID**: (Generated in AWS Console → IAM → Users → Security Credentials)
   - **AWS Secret Access Key**: (Generated alongside your Access Key)
   - **Default region name**: `us-east-1` (or your preferred region like `eu-west-1` or `ap-south-1`)
   - **Default output format**: `json`

---

## 3. Method 1 (Recommended): AWS S3 + CloudFront Global CDN

### 3.1 Automated 1-Click Script

We have already configured an automated deployment script in this codebase that uses AWS CloudFormation to provision the entire cloud infrastructure and upload the app in one command:

```bash
# In your terminal inside the project root:
./deploy-aws-s3-cloudfront.sh
```

**What this script does automatically:**
1. Verifies your AWS credentials.
2. Runs `npm run build` to create optimized production assets.
3. Deploys `cloudformation-template.yaml` which automatically configures:
   - Private S3 Bucket with AES256 server-side encryption.
   - CloudFront Origin Access Control (OAC).
   - Global CloudFront CDN distribution with HTTP/2 & HTTP/3.
   - Client-side SPA error responses (403/404 -> index.html).
4. Syncs all production assets to S3 with optimal cache-control headers (`max-age=31536000` for JS/CSS; `no-cache` for `index.html`).
5. Invalidates the CloudFront cache.
6. Prints your live `https://dXXXXXXXXX.cloudfront.net` URL!

---

### 3.2 AWS Management Console (GUI) Walkthrough

If you prefer using the AWS Web Browser Console:

#### Step 1: Build the app locally
```bash
npm run build
```
This generates the `dist/` directory containing `index.html` and the `assets/` folder.

#### Step 2: Create the Amazon S3 Bucket
1. Open the [AWS S3 Console](https://s3.console.aws.amazon.com/).
2. Click **Create bucket**.
3. **Bucket name**: Choose a globally unique name, e.g., `aura-mna-platform-YOURNAME`.
4. **AWS Region**: Select `US East (N. Virginia) us-east-1` (or your preferred region).
5. **Block Public Access settings**: Keep **Block all public access** CHECKED (CloudFront will access it securely via OAC).
6. Click **Create bucket**.

#### Step 3: Upload files to S3
1. Click on your newly created bucket name.
2. Click **Upload** → **Add files** (select `index.html` from `dist/`).
3. Click **Add folder** (select the `assets/` folder from `dist/`).
4. Click **Upload**.

#### Step 4: Create CloudFront Distribution
1. Open the [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/).
2. Click **Create distribution**.
3. **Origin domain**: Click the dropdown and select your S3 bucket.
4. **Origin access**: Select **Origin access control settings (recommended)**.
   - Click **Create new OAC** → Leave defaults → Click **Create**.
5. **Viewer protocol policy**: Select **Redirect HTTP to HTTPS**.
6. **Allowed HTTP methods**: Select `GET, HEAD`.
7. **Cache key and origin requests**: Select **CachePolicy: CachingOptimized**.
8. **Default root object**: Enter `index.html`.
9. Click **Create distribution**.

#### Step 5: Update S3 Bucket Policy (OAC Permission)
1. A blue notification banner will appear at the top of CloudFront saying *"The S3 bucket policy needs to be updated"*.
2. Click **Copy policy**.
3. Go back to your S3 bucket → **Permissions** tab → **Bucket policy** → Click **Edit**.
4. Paste the policy and click **Save changes**.

#### Step 6: Configure SPA Error Pages in CloudFront
1. In CloudFront, click your distribution → **Error pages** tab.
2. Click **Create custom error response**:
   - HTTP error code: `403: Forbidden`
   - Customize error response: `Yes`
   - Response page path: `/index.html`
   - HTTP Response code: `200: OK`
3. Click **Create**.
4. Repeat for `404: Not Found` (Path: `/index.html`, Response code: `200: OK`).

Your app is now live! Go to the **General** tab and copy your **Distribution domain name** (e.g. `https://d1234abcd.cloudfront.net`).

---

### 3.3 Manual AWS CLI Step-by-Step

```bash
# 1. Build the React application
npm run build

# 2. Create the S3 bucket
aws s3 mb s3://my-mna-platform-2026 --region us-east-1

# 3. Block all public access on the bucket
aws s3api put-public-access-block \
    --bucket my-mna-platform-2026 \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# 4. Sync production files to S3
aws s3 sync dist/ s3://my-mna-platform-2026/ --delete

# 5. Invalidate CloudFront (after distribution creation)
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 4. Method 2: AWS Amplify Hosting

AWS Amplify is the easiest Git-integrated hosting platform on AWS, providing continuous integration and deployment (CI/CD).

### Steps:
1. Initialize Git and push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete AURA M&A precision platform"
   git branch -M main
   # Add your github remote and push
   git remote add origin https://github.com/YOUR_USERNAME/mna-platform.git
   git push -u origin main
   ```
2. Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
3. Click **Deploy an app** → Select **GitHub**.
4. Authorize AWS Amplify to access your GitHub repository.
5. Select the repository and `main` branch.
6. Amplify automatically detects Vite. Ensure the build settings are:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
7. Click **Save and deploy**.
8. In ~90 seconds, Amplify provisions SSL, builds the app, and gives you a live `https://main.dXXXXXXXXX.amplifyapp.com` link.

---

## 5. Method 3: Dockerized Container on AWS App Runner / ECS

If your enterprise corporate security policy requires running applications inside a Docker container:

We have included a multi-stage `Dockerfile` and `nginx.conf` in your workspace.

### Steps:
```bash
# 1. Build the Docker container locally to verify
docker build -t aura-mna:latest .

# 2. Test locally
docker run -p 8080:80 aura-mna:latest
# Open http://localhost:8080 in your browser!

# 3. Create an Amazon Elastic Container Registry (ECR) repository
aws ecr create-repository --repository-name aura-mna --region us-east-1

# 4. Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# 5. Tag and push the image
docker tag aura-mna:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/aura-mna:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/aura-mna:latest

# 6. Deploy to AWS App Runner
# Go to AWS App Runner Console -> Create Service -> Source: Amazon ECR -> Select your image.
# App Runner will automatically provide load balancing, auto-scaling, and a public HTTPS URL.
```

---

## 6. Configuring a Custom Domain & Free SSL (Route 53 & ACM)

To host your platform under a branded domain like `mna.yourcompany.com`:

1. **Request a Free SSL Certificate in AWS Certificate Manager (ACM)**:
   - **Important**: The certificate must be created in **`us-east-1` (N. Virginia)** for CloudFront to use it.
   - Go to ACM Console → **Request certificate** → Public certificate → Enter `mna.yourcompany.com`.
   - Choose **DNS validation** → Click **Request**.
   - Click **Create records in Route 53** to auto-validate domain ownership in seconds.

2. **Attach Certificate to CloudFront**:
   - In CloudFront Distribution Settings → **Alternate domain names (CNAMEs)** → Add `mna.yourcompany.com`.
   - **Custom SSL certificate**: Select the ACM certificate you just validated.
   - Click **Save changes**.

3. **Point Route 53 to CloudFront**:
   - In Route 53 Console → Hosted Zones → Select your domain.
   - Click **Create record**.
   - Record name: `mna`
   - Record type: `A - Routes traffic to an IPv4 address`.
   - Toggle **Alias** to ON.
   - Route traffic to: **Alias to CloudFront distribution** → Select your distribution.
   - Click **Create records**.

Your custom domain is now live with HTTPS!

---

## 7. Cost Estimation & AWS Free Tier Details

Static hosting on S3 + CloudFront is virtually **free** for typical business traffic:

| AWS Service | Free Tier Allowance | Standard Cost Beyond Free Tier | Estimated Monthly Bill |
|---|---|---|---|
| **Amazon S3** | 5 GB storage, 20,000 GET requests | $0.023 per GB/mo | **$0.01 - $0.05 / mo** |
| **Amazon CloudFront** | **1 TB data transfer out/month**, 10,000,000 HTTP/HTTPS requests | $0.085 per GB | **$0.00 / mo** (covered by free tier) |
| **AWS Certificate Manager (ACM)**| Unlimited SSL certificates | Free | **$0.00 / mo** |
| **Route 53 DNS** | None | $0.50 per hosted zone/month | **$0.50 / mo** |
| **TOTAL** | — | — | **~$0.55 / month** |

*Compared to running an EC2 t3.medium instance which costs ~$30-$40/month, S3 + CloudFront saves you over 98% in operating expenses while offering higher reliability and faster global speeds.*

---

## 8. Production Security & Operations Checklist

- [x] **Enforce HTTPS**: CloudFront viewer protocol policy set to `redirect-to-https`.
- [x] **Private S3 Origin**: `Block all public access` enabled on S3; authenticated via CloudFront Origin Access Control (OAC).
- [x] **SPA Routing**: Error codes 403 and 404 mapped to `/index.html` with HTTP 200.
- [x] **Asset Caching**: Hashed static assets (`/assets/*.js`, `/assets/*.css`) cached for 1 year (`max-age=31536000`), `index.html` configured with `no-cache` for instant updates.
- [x] **Security Headers**: HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN configured.
- [x] **Disaster Recovery**: S3 bucket versioning can be toggled in S3 console for accidental overwrite protection.

---
*Generated for AURA M&A™ Precision Intelligence Platform*
