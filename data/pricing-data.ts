export interface PricingRow {
  id: string;
  app: string;
  cost100: number | null;
  cost1000: number | null;
  cost10000: number | null;
  notes: string;
  details?: {
    why: string;
    how: string;
    where: string;
    breakdown?: string;
  };
}

export const pricingData: PricingRow[] = [
  {
    id: 'vapi-calls',
    app: 'VAPI (estimated $0.20 per minute - 3 minutes average - 1000 calls / month / user = $0.60 per call)',
    cost100: 60000,
    cost1000: 600000,
    cost10000: null,
    notes: '',
    details: {
      why: 'Core voice AI platform for handling phone calls',
      how: '$0.20 per minute × 3 minutes average × 1000 calls/month/user',
      where: 'VAPI API infrastructure',
      breakdown: 'Per user: 1000 calls × 3 min × $0.20 = $600/month'
    }
  },
  {
    id: 'vapi-concurrent',
    app: 'VAPI ~10 concurrent calls per user = ~100$',
    cost100: 10000,
    cost1000: 100000,
    cost10000: null,
    notes: 'For enterprise, VAPI offers unlimited concurrent calls. Means we can cut all cost here.',
    details: {
      why: 'Concurrent call capacity for handling multiple simultaneous calls',
      how: '~10 concurrent calls per user × $10 per concurrent call capacity',
      where: 'VAPI infrastructure scaling',
      breakdown: 'Enterprise plans offer unlimited concurrent calls, reducing this cost to $0'
    }
  },
  {
    id: 'frontend',
    app: 'Frontend - Netlify / Vercel',
    cost100: 20,
    cost1000: 60,
    cost10000: null,
    notes: '',
    details: {
      why: 'Hosting for the web application frontend',
      how: 'Static site hosting with CDN',
      where: 'Netlify or Vercel cloud infrastructure',
      breakdown: 'Scales with bandwidth and build minutes'
    }
  },
  {
    id: 'backend',
    app: 'Backend - Render (fastest)',
    cost100: 450,
    cost1000: 450,
    cost10000: null,
    notes: '',
    details: {
      why: 'Server infrastructure for API and business logic',
      how: 'Cloud hosting with auto-scaling',
      where: 'Render cloud platform',
      breakdown: 'Fixed cost regardless of user count at this tier'
    }
  },
  {
    id: 'llm-after-call',
    app: 'LLM API (after-call processing)',
    cost100: 600,
    cost1000: 5000,
    cost10000: 50000,
    notes: 'Prices listed are in full. For Bulk buying we will get tokens at half the price.',
    details: {
      why: 'AI processing of call transcripts and summaries',
      how: 'Token-based pricing for LLM API calls',
      where: 'OpenAI/Anthropic API',
      breakdown: 'Bulk purchasing can reduce costs by 50%'
    }
  },
  {
    id: 'llm-chat-support',
    app: 'LLM Chat Support (smart assistant)',
    cost100: 300,
    cost1000: 3000,
    cost10000: 30000,
    notes: 'Prices listed are in full. For Bulk buying we will get tokens at half the price.',
    details: {
      why: 'AI-powered customer support chatbot',
      how: 'Token-based pricing for chat interactions',
      where: 'LLM API providers',
      breakdown: 'Bulk purchasing can reduce costs by 50%'
    }
  },
  {
    id: 'llm-agent-setup',
    app: 'LLM (AI to help set up agents)',
    cost100: null,
    cost1000: null,
    cost10000: null,
    notes: '',
    details: {
      why: 'AI assistance for configuring call agents',
      how: 'On-demand LLM calls during setup',
      where: 'LLM API providers',
      breakdown: 'Variable cost based on usage'
    }
  },
  {
    id: 'phantombuster',
    app: 'PhantomBuster (used for scraping leads with LinkedIn Sales Navigator & Google Maps) - Estimated at ~2000 total leads scraped daily',
    cost100: 56,
    cost1000: 56,
    cost10000: 56,
    notes: '',
    details: {
      why: 'Automated lead scraping from LinkedIn and Google Maps',
      how: '~2000 leads scraped daily × monthly subscription',
      where: 'PhantomBuster platform',
      breakdown: 'Fixed cost regardless of user count'
    }
  },
  {
    id: 'database',
    app: 'Database (Supabase)',
    cost100: 25,
    cost1000: 60,
    cost10000: null,
    notes: '',
    details: {
      why: 'Primary database for user data, call records, and application state',
      how: 'PostgreSQL hosting with storage and bandwidth',
      where: 'Supabase cloud infrastructure',
      breakdown: 'Scales with storage and query volume'
    }
  },
  {
    id: 'apollo',
    app: 'Apollo.io - Scraping - ~2,000 leads per day\n\n$0.20/credit\n\n1 credit = export\n1 credit = verified email\n8 credits = phone number\ntotal = 10 credits',
    cost100: 120000,
    cost1000: 120000,
    cost10000: 120000,
    notes: '',
    details: {
      why: 'Lead enrichment and contact data scraping',
      how: '~2,000 leads/day × 10 credits/lead × $0.20/credit × 30 days',
      where: 'Apollo.io API',
      breakdown: '2,000 leads × 10 credits × $0.20 × 30 days = $120,000/month'
    }
  },
  {
    id: 'linkedin',
    app: 'LinkedIn Sales Navigator',
    cost100: 120,
    cost1000: 120,
    cost10000: 120,
    notes: '',
    details: {
      why: 'Access to LinkedIn Sales Navigator for lead research',
      how: 'Monthly subscription per account',
      where: 'LinkedIn platform',
      breakdown: 'Fixed monthly subscription cost'
    }
  },
  {
    id: 'custom-stt-tts',
    app: 'Custom STT + TTS + LLM',
    cost100: null,
    cost1000: null,
    cost10000: 3900000,
    notes: 'GPT-4o: ~$0.0068 per minute\nGPT-5 / GPT-5.1: $0.0049 per minute\n\nDeepgram (STT): $0.05/min\n\nElevenLabs (TTS): $0.075/min\n\nTotal: ~$0.13/min\n\nCosts are not assuming the lower price from the LLM provider, if bought in bulk.',
    details: {
      why: 'Custom speech-to-text, text-to-speech, and LLM stack for 10,000 users',
      how: '10,000 users × 1,000 calls/user/month × 3 min/call × $0.13/min',
      where: 'Deepgram (STT), ElevenLabs (TTS), GPT-4o/5 (LLM)',
      breakdown: '10M calls × 3 min × $0.13 = $3,900,000/month. Bulk pricing can reduce LLM costs significantly.'
    }
  },
  {
    id: 'aws',
    app: 'Frontend + Backend + Database on AWS (Amazon Web Services)',
    cost100: null,
    cost1000: 4062,
    cost10000: 31831,
    notes: 'AWS pricing for 1,000+ users production scale',
    details: {
      why: 'AWS costs more because it provides enterprise-grade reliability by default: Multi-AZ redundancy (2-3 copies of everything), dedicated hardware, guaranteed performance, and enterprise compliance. Supabase/Render/Vercel use shared infrastructure, oversubscribed resources, and cheaper bandwidth—trading reliability for cost efficiency. You pay for AWS\'s fault tolerance, isolation, and predictable performance.',
      how: 'EC2, S3, RDS, CloudFront, ALB, CloudWatch, and backup services',
      where: 'Amazon Web Services cloud',
      breakdown: `1,000 Users (1M calls/month, 30TB storage/month):
Service                    Configuration                          Monthly Cost
─────────────────────────────────────────────────────────────────────────────
Frontend                   S3 + CloudFront                        $50
Backend                    4× m5.xlarge (1-year RI)              $336
Database                   RDS r5.xlarge Multi-AZ (1-year RI)    $346
Storage                    S3 with lifecycle policies (6-mo)      $2,206
Data Transfer              7TB outbound @ $0.09/GB               $630
Load Balancer              Application Load Balancer               $28
CloudWatch                 Logs, metrics, alarms                  $156
Backups/DR                 Snapshots, cross-region replication    $310
─────────────────────────────────────────────────────────────────────────────
TOTAL                                                              $4,062
Per user                                                           $4.06
Per call                                                           $0.00

10,000 Users (10M calls/month, 300TB storage/month):
Service                    Configuration                          Monthly Cost
─────────────────────────────────────────────────────────────────────────────
Frontend                   S3 + CloudFront                        $500
Backend                    16× m5.2xlarge (RI + Spot mix)        $2,199
Database                   RDS r5.4xlarge Multi-AZ (1-year RI)   $3,404
Storage                    S3 with lifecycle policies            $15,512
Data Transfer              50TB outbound                           $4,300
Load Balancer              2× ALB for redundancy                  $126
CloudWatch                 Enhanced monitoring                    $1,290
Backups/DR                 Enhanced backup strategy               $4,500
─────────────────────────────────────────────────────────────────────────────
TOTAL                                                              $31,831
Per user                                                           $3.18
Per call                                                           $0.00`
    }
  },
  {
    id: 'payment-processor',
    app: 'Payment Processor (e.g. Stripe)\n\nPayments - Free\nOptional:\nCustom domain / Our name - $10/month\nRadar to detect fraud + custom rules - $0.02 per payment',
    cost100: 12,
    cost1000: 30,
    cost10000: 210,
    notes: '',
    details: {
      why: 'Payment processing and fraud detection',
      how: 'Stripe fees: $0.02 per payment for Radar + optional $10/month custom domain',
      where: 'Stripe payment platform',
      breakdown: 'Scales with transaction volume'
    }
  },
  {
    id: 'github',
    app: 'GitHub\n\nWhere all our code lives — secure, scalable, professional\n\nMore security (protected branches, scans, access control)\nMore space (bigger repos, more storage, more Actions minutes)\nBetter teamwork (reviews, permissions, SSO)\nCompliance-ready (audit logs, investor-safe)\nScales with us (proper workflows for 100 → 10,000 users)\n\nEstimated: $4–$21 per user/month',
    cost100: 0,
    cost1000: 4,
    cost10000: 21,
    notes: '',
    details: {
      why: 'Code repository, CI/CD, and development collaboration',
      how: 'GitHub Team/Enterprise plans with per-user pricing',
      where: 'GitHub cloud platform',
      breakdown: 'FREE for small teams, $4/user for Team, $21/user for Enterprise'
    }
  },
  {
    id: 'twilio',
    app: 'Twilio (for WebRTC)',
    cost100: 1200,
    cost1000: 12000,
    cost10000: 120000,
    notes: 'Minutes per user: 1,000 calls * 3 minutes each = 3,000 minutes per user each month.\n\nYour cost per user: 3,000 minutes * $0.004 per minute = $12 per user each month.',
    details: {
      why: 'WebRTC infrastructure for real-time voice communication',
      how: '1,000 calls/user × 3 min/call × $0.004/min = $12/user/month',
      where: 'Twilio cloud communications platform',
      breakdown: '100 users: $1,200 | 1,000 users: $12,000 | 10,000 users: $120,000'
    }
  },
  {
    id: 'make-com',
    app: 'Make.com (used for scraping leads)',
    cost100: 678,
    cost1000: 678,
    cost10000: 678,
    notes: '60k leads per month - ~600,000 operations',
    details: {
      why: 'Automated lead scraping workflow automation',
      how: 'Fixed monthly cost for ~600,000 operations handling 60k leads per month',
      where: 'Make.com automation platform',
      breakdown: 'Fixed cost: $678/month regardless of user count\n60,000 leads/month\n~600,000 operations/month'
    }
  },
  {
    id: 'custom-website-chatbot',
    app: 'Custom Website Chatbot',
    cost100: 17000,
    cost1000: 170000,
    cost10000: 1700000,
    notes: '~30,000 tokens per user interaction.\n\n~1,000 website users per month\n\n= 30,000,000 tokens for 1 PointCall client\n\n(~$170)\n\n(GPT 5 Calculation)',
    details: {
      why: 'AI-powered chatbot for customer websites',
      how: '~30,000 tokens per user interaction × ~1,000 website users/month = 30,000,000 tokens/client',
      where: 'GPT-5 API for chatbot interactions',
      breakdown: 'Per PointCall client:\n- ~30,000 tokens per user interaction\n- ~1,000 website users per month\n- Total: 30,000,000 tokens per client\n- Cost: ~$170 per client\n- Calculation based on GPT-5 pricing'
    }
  }
];

