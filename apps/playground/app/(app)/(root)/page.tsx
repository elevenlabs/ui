import { Metadata } from "next";

import { ElevenLabsLogo } from "@/components/elevenlabs-logo";
import { FeaturedNav } from "@/components/featured-nav";
import {
  PageHeader,
  PageHeaderDescription,
} from "@/components/global-page-header";
import { PageNav } from "@/components/page-nav";
import { ShowcaseCTA } from "@/components/showcase-cta";

const title = "Explore";
const description =
  "Explore a curated gallery of voice and audio experiences powered by ElevenLabs. Discover what developers and teams are shipping today.";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default async function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader>
        <ElevenLabsLogo text="Showcase" />
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <ShowcaseCTA />
      </PageHeader>
      <PageNav>
        <FeaturedNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
      </PageNav>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          <section className="theme-container">
            {/* <ProjectList projects={projects} /> */}
          </section>
        </div>
      </div>
    </div>
  );
}
