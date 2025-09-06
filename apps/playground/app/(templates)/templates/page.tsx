import Link from 'next/link';
import { Metadata } from 'next';

import { Button } from '@elevenlabs/ui/components/button';
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from '@elevenlabs/ui/components/ui/minimal-card';
import { OpenInV0Button } from '@/components/open-in-v0-button';
import { Badge } from '@elevenlabs/ui/components/badge';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Agent Templates - ElevenLabs',
  description: 'Ready-to-use voice agent templates for various use cases',
};

const AGENT_TEMPLATES = [
  {
    id: 'customer-support-agent',
    name: 'customer-support-agent',
    title: 'Customer Support Agent',
    description:
      'Professional voice agent for handling customer inquiries with empathy and efficiency',
    category: 'Support',
    src: 'https://elevenlabs.io/assets/images/convai/convai-gradient.svg',
    features: [
      'Multi-language support',
      'Sentiment analysis',
      'CRM integration',
    ],
  },
  {
    id: 'sales-assistant',
    name: 'sales-assistant',
    title: 'Sales Assistant',
    description:
      'Engaging voice agent that qualifies leads and books meetings with your sales team',
    category: 'Sales',
    src: 'https://elevenlabs.io/assets/images/convai/convai-gradient.svg',
    features: [
      'Lead qualification',
      'Calendar integration',
      'Follow-up automation',
    ],
  },
  {
    id: 'personal-tutor',
    name: 'personal-tutor',
    title: 'Personal Tutor',
    description:
      'Educational voice agent that adapts to individual learning styles and paces',
    category: 'Education',
    src: 'https://elevenlabs.io/assets/images/convai/convai-gradient.svg',
    features: ['Adaptive learning', 'Progress tracking', 'Interactive lessons'],
  },
  {
    id: 'healthcare-assistant',
    name: 'healthcare-assistant',
    title: 'Healthcare Assistant',
    description:
      'HIPAA-compliant voice agent for appointment scheduling and patient triage',
    category: 'Healthcare',
    src: 'https://elevenlabs.io/assets/images/convai/convai-gradient.svg',
    features: ['HIPAA compliant', 'Appointment booking', 'Symptom assessment'],
  },
  {
    id: 'real-estate-agent',
    name: 'real-estate-agent',
    title: 'Real Estate Agent',
    description:
      'Voice agent that provides property information and schedules viewings',
    category: 'Real Estate',
    src: 'https://elevenlabs.io/assets/images/convai/convai-gradient.svg',
    features: ['Property search', 'Virtual tours', 'Viewing scheduler'],
  },
  {
    id: 'travel-concierge',
    name: 'travel-concierge',
    title: 'Travel Concierge',
    description:
      'Sophisticated voice agent for travel planning and booking assistance',
    category: 'Travel',
    src: 'https://elevenlabs.io/assets/images/convai/convai-gradient.svg',
    features: [
      'Itinerary planning',
      'Booking assistance',
      'Local recommendations',
    ],
  },
];

const categoryColors = {
  Support: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Sales: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Education: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  Healthcare: 'bg-red-500/10 text-red-700 dark:text-red-400',
  'Real Estate': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  Travel: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
};

export default async function TemplatesPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-background">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-16 md:py-20 lg:py-24">
            <Badge variant="secondary" className="mb-4">
              Agent Templates
            </Badge>
            <h1 className="tracking-tight text-balance text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl text-foreground">
              Ready-to-use Voice Agents
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Start with a pre-configured agent template and customize it to
              your needs. Each template includes best practices for its specific
              use case.
            </p>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AGENT_TEMPLATES.map(template => (
              <MinimalCard
                key={template.id}
                className="group relative overflow-hidden border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-background hover:bg-accent/5 transition-colors"
              >
                {/* Card Image */}
                <div className="relative">
                  <MinimalCardImage
                    src={template.src}
                    alt={template.title}
                    className="h-[240px] [&_img]:transition-transform [&_img]:duration-300 [&_img]:group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent rounded-[16px]" />

                  {/* Category badge */}
                  <Badge
                    className={`absolute top-3 left-3 ${categoryColors[template.category as keyof typeof categoryColors]}`}
                    variant="secondary"
                  >
                    {template.category}
                  </Badge>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <MinimalCardTitle className="text-xl mb-2">
                    {template.title}
                  </MinimalCardTitle>
                  <MinimalCardDescription className="mb-4 line-clamp-2">
                    {template.description}
                  </MinimalCardDescription>

                  {/* Features */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs text-muted-foreground"
                      >
                        {feature}
                        {index < template.features.length - 1 && ' • '}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <OpenInV0Button
                      name={template.name}
                      className="flex-1"
                      variant="default"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-[1.8rem]"
                      asChild
                    >
                      <Link href={`/docs/templates/${template.id}`}>
                        View Docs
                      </Link>
                    </Button>
                  </div>
                </div>
              </MinimalCard>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Can't find what you're looking for?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/docs/custom-agents">Build Custom Agent</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/contact">Request Template</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
