import React, { useState } from 'react';
import { 
  Cloud, 
  Terminal, 
  Check, 
  Copy, 
  Server, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  Layers, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const AwsDeploymentGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'s3-cloudfront' | 'amplify' | 'docker-ecs' | 'ec2'>('s3-cloudfront');
  const [bucketName, setBucketName] = useState('aura-mna-platform-prod');
  const [awsRegion, setAwsRegion] = useState('us-east-1');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const s3Commands = [
    {
      title: 'Step 1: Test & Build the Production Web App Bundle',
      desc: 'Compiles TypeScript, minifies HTML/JS/CSS, and outputs optimized static assets into the /dist folder.',
      cmd: `npm run build`,
    },
    {
      title: 'Step 2: Create a Dedicated Amazon S3 Storage Bucket',
      desc: 'Creates a private S3 bucket in your selected AWS region to hold the compiled application files.',
      cmd: `aws s3api create-bucket --bucket ${bucketName} --region ${awsRegion} ${awsRegion === 'us-east-1' ? '' : `--create-bucket-configuration LocationConstraint=${awsRegion}`}`,
    },
    {
      title: 'Step 3: Upload the Production Bundle to S3',
      desc: 'Syncs all files from dist/ to your S3 bucket with optimal cache-control headers.',
      cmd: `aws s3 sync dist/ s3://${bucketName}/ --delete`,
    },
    {
      title: 'Step 4: Create CloudFront CDN Distribution with Origin Access Control (OAC)',
      desc: 'Distributes your app globally across 400+ edge locations with free HTTPS and low latency. You can run our automated script or create it via AWS CLI:',
      cmd: `./deploy-aws-s3-cloudfront.sh`,
    },
    {
      title: 'Step 5: Invalidate CloudFront Cache on Updates',
      desc: 'Forces global edge edge locations to refresh immediately when you deploy a new version.',
      cmd: `aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"`,
    },
  ];

  const dockerCommands = [
    {
      title: 'Step 1: Authenticate Docker CLI to AWS ECR',
      desc: 'Get authorization token for your AWS Elastic Container Registry.',
      cmd: `aws ecr get-login-password --region ${awsRegion} | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.${awsRegion}.amazonaws.com`,
    },
    {
      title: 'Step 2: Build the Production Docker Image',
      desc: 'Builds multi-stage Docker container with Alpine Nginx server.',
      cmd: `docker build -t aura-mna-platform:latest .`,
    },
    {
      title: 'Step 3: Tag and Push Image to Amazon ECR',
      desc: 'Uploads the image to your private AWS container registry.',
      cmd: `docker tag aura-mna-platform:latest YOUR_ACCOUNT_ID.dkr.ecr.${awsRegion}.amazonaws.com/aura-mna:latest\ndocker push YOUR_ACCOUNT_ID.dkr.ecr.${awsRegion}.amazonaws.com/aura-mna:latest`,
    },
    {
      title: 'Step 4: Launch on AWS App Runner or Amazon ECS',
      desc: 'App Runner automatically runs the container and provides auto-scaling, load balancing, and SSL.',
      cmd: `aws apprunner create-service --service-name aura-mna-service --source-configuration ImageRepository='{ImageIdentifier="YOUR_ECR_URI",ImageRepositoryType="ECR"}'`,
    },
  ];

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px', width: '100%' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#ffffff',
          }}>
            <Cloud size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AWS Cloud Hosting & Deployment Master Guide</h1>
              <span className="badge badge-amber">Production Architecture</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
              Understand the complete cloud architecture, security best practices, and copy-paste steps to host AURA M&A on Amazon Web Services.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Cloud Architecture Diagram */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--accent-cyan)" />
          Recommended AWS Cloud Architecture (S3 + CloudFront Global CDN)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Industry-standard architecture for modern Single-Page Applications: 99.99% availability, automated SSL, global edge caching, and near-zero idle cost.
        </p>

        {/* Interactive SVG Diagram */}
        <div style={{
          background: '#090d16',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          overflowX: 'auto',
          textAlign: 'center',
        }}>
          <svg viewBox="0 0 960 220" style={{ width: '100%', maxWidth: '960px', height: 'auto', margin: '0 auto' }}>
            <defs>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Connecting Flow Lines */}
            <line x1="140" y1="110" x2="260" y2="110" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />
            <line x1="380" y1="110" x2="500" y2="110" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />
            <line x1="620" y1="110" x2="740" y2="110" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4" />

            {/* Box 1: User / Browser */}
            <g transform="translate(20, 50)">
              <rect width="120" height="120" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <circle cx="60" cy="45" r="20" fill="rgba(6, 182, 212, 0.15)" />
              <text x="60" y="50" textAnchor="middle" fill="#06b6d4" fontSize="18">🌐</text>
              <text x="60" y="85" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">Client / Browser</text>
              <text x="60" y="102" textAnchor="middle" fill="#94a3b8" fontSize="10">HTTPS Request</text>
            </g>

            {/* Box 2: Route 53 + ACM */}
            <g transform="translate(260, 50)">
              <rect width="120" height="120" rx="12" fill="#0f172a" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.5" />
              <circle cx="60" cy="45" r="20" fill="rgba(245, 158, 11, 0.15)" />
              <text x="60" y="50" textAnchor="middle" fill="#f59e0b" fontSize="18">⚡</text>
              <text x="60" y="85" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">AWS Route 53</text>
              <text x="60" y="102" textAnchor="middle" fill="#94a3b8" fontSize="10">DNS & ACM SSL</text>
            </g>

            {/* Box 3: CloudFront CDN */}
            <g transform="translate(500, 50)">
              <rect width="120" height="120" rx="12" fill="#0f172a" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
              <circle cx="60" cy="45" r="20" fill="rgba(6, 182, 212, 0.2)" />
              <text x="60" y="50" textAnchor="middle" fill="#06b6d4" fontSize="18">🚀</text>
              <text x="60" y="85" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">CloudFront CDN</text>
              <text x="60" y="102" textAnchor="middle" fill="#22d3ee" fontSize="10">400+ Edge PoPs</text>
            </g>

            {/* Box 4: S3 Bucket (Protected by OAC) */}
            <g transform="translate(740, 50)">
              <rect width="120" height="120" rx="12" fill="#0f172a" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" />
              <circle cx="60" cy="45" r="20" fill="rgba(16, 185, 129, 0.15)" />
              <text x="60" y="50" textAnchor="middle" fill="#10b981" fontSize="18">🗄️</text>
              <text x="60" y="85" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">Amazon S3</text>
              <text x="60" y="102" textAnchor="middle" fill="#34d399" fontSize="10">Private App Assets</text>
            </g>
          </svg>
        </div>

        {/* Why this architecture table */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginTop: '20px',
        }}>
          <div style={{ background: '#0b1120', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 700 }}>
              <DollarSign size={15} />
              Ultra-Low Cost (~$0.50/mo)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              No idle servers or virtual machine bills. Pay only for bytes served.
            </div>
          </div>

          <div style={{ background: '#0b1120', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700 }}>
              <ShieldCheck size={15} />
              Enterprise Security & OAC
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              S3 bucket is strictly private; only CloudFront edge CDN has read access.
            </div>
          </div>

          <div style={{ background: '#0b1120', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.85rem', fontWeight: 700 }}>
              <Globe size={15} />
              Global Sub-50ms Latency
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Cached across 400+ AWS Point of Presence (PoP) edge nodes globally.
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Method Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('s3-cloudfront')}
          className="btn"
          style={{
            background: activeTab === 's3-cloudfront' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
            border: activeTab === 's3-cloudfront' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
            color: activeTab === 's3-cloudfront' ? '#ffffff' : 'var(--text-muted)',
          }}
        >
          <Globe size={15} />
          <span>Method 1: S3 + CloudFront CDN (Recommended)</span>
        </button>

        <button
          onClick={() => setActiveTab('amplify')}
          className="btn"
          style={{
            background: activeTab === 'amplify' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
            border: activeTab === 'amplify' ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
            color: activeTab === 'amplify' ? '#ffffff' : 'var(--text-muted)',
          }}
        >
          <Layers size={15} />
          <span>Method 2: AWS Amplify (Git CI/CD)</span>
        </button>

        <button
          onClick={() => setActiveTab('docker-ecs')}
          className="btn"
          style={{
            background: activeTab === 'docker-ecs' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: activeTab === 'docker-ecs' ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
            color: activeTab === 'docker-ecs' ? '#ffffff' : 'var(--text-muted)',
          }}
        >
          <Server size={15} />
          <span>Method 3: Docker & AWS App Runner</span>
        </button>

        <button
          onClick={() => setActiveTab('ec2')}
          className="btn"
          style={{
            background: activeTab === 'ec2' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            border: activeTab === 'ec2' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
            color: activeTab === 'ec2' ? '#ffffff' : 'var(--text-muted)',
          }}
        >
          <Cpu size={15} />
          <span>Method 4: AWS EC2 + Nginx</span>
        </button>
      </div>

      {/* METHOD 1: S3 + CLOUDFRONT */}
      {activeTab === 's3-cloudfront' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customizer Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
              Customize Your AWS Parameters:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>S3 Bucket:</span>
              <input
                type="text"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                className="input-text"
                style={{ width: '240px', padding: '4px 8px', fontSize: '0.8rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AWS Region:</span>
              <select
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                style={{
                  background: '#0b1120',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                }}
              >
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="us-west-2">us-west-2 (Oregon)</option>
                <option value="eu-west-1">eu-west-1 (Ireland)</option>
                <option value="ap-south-1">ap-south-1 (Mumbai)</option>
                <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
              </select>
            </div>
          </div>

          {/* Steps List */}
          {s3Commands.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{step.title}</h4>
                <button
                  onClick={() => copyToClipboard(step.cmd, idx)}
                  className="btn btn-secondary btn-sm"
                  id={`btn-copy-step-${idx}`}
                >
                  {copiedIndex === idx ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy Command'}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {step.desc}
              </p>
              <div style={{
                background: '#090d16',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {step.cmd}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* METHOD 2: AWS AMPLIFY */}
      {activeTab === 'amplify' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
            AWS Amplify Hosting (Git-Driven Automation)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            AWS Amplify provides the smoothest developer workflow. Whenever you push changes to your GitHub/GitLab repository, Amplify automatically builds and redeploys the app with full CDN edge distribution, preview PR branches, and custom SSL certificates.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: '#ffffff' }}>Step 1: Initialize Git and Push to GitHub</strong>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>
                git init<br />
                git add .<br />
                git commit -m "Initial commit of AURA M&A platform"<br />
                git branch -M main<br />
                git remote add origin https://github.com/YOUR_USERNAME/mna-platform.git<br />
                git push -u origin main
              </div>
            </div>

            <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: '#ffffff' }}>Step 2: Connect Repository in AWS Console</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                1. Navigate to <strong>AWS Console → AWS Amplify → Host web app</strong>.<br />
                2. Select <strong>GitHub</strong>, authorize AWS, and select your repository.<br />
                3. Amplify automatically detects Vite! Confirm build settings (build command: <code style={{ color: 'var(--accent-cyan)' }}>npm run build</code>, base directory: <code style={{ color: 'var(--accent-cyan)' }}>dist</code>).<br />
                4. Click <strong>Save and Deploy</strong>. Your live HTTPS URL will be ready in ~90 seconds!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 3: DOCKER & APP RUNNER */}
      {activeTab === 'docker-ecs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
              Dockerized Container Deployment (AWS App Runner / ECS)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              We have already included an optimized multi-stage <code style={{ color: 'var(--accent-cyan)' }}>Dockerfile</code> and <code style={{ color: 'var(--accent-cyan)' }}>nginx.conf</code> in your project root.
            </p>
          </div>

          {dockerCommands.map((step, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{step.title}</h4>
                <button
                  onClick={() => copyToClipboard(step.cmd, 10 + idx)}
                  className="btn btn-secondary btn-sm"
                >
                  {copiedIndex === 10 + idx ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copiedIndex === 10 + idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{step.desc}</p>
              <div style={{
                background: '#090d16',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                color: 'var(--accent-cyan)',
                whiteSpace: 'pre-wrap',
              }}>
                {step.cmd}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* METHOD 4: EC2 + NGINX */}
      {activeTab === 'ec2' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
            Classic AWS EC2 Virtual Machine Setup
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            For dedicated VM environments (e.g. within an enterprise corporate VPC):
          </p>
          <div style={{ background: '#0b1120', padding: '16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.7 }}>
            # 1. SSH into Amazon Linux 2023 EC2 instance<br />
            ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP<br /><br />
            # 2. Install Node.js 22 & Nginx<br />
            sudo dnf update -y<br />
            sudo dnf install -y nginx git<br />
            sudo systemctl enable nginx --now<br /><br />
            # 3. Clone and build application<br />
            git clone YOUR_REPO_URL app && cd app<br />
            npm install && npm run build<br />
            sudo cp -r dist/* /usr/share/nginx/html/<br /><br />
            # 4. Configure /etc/nginx/conf.d/mna.conf for SPA routing & restart<br />
            sudo systemctl restart nginx
          </div>
        </div>
      )}
    </div>
  );
};
