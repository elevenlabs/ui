import { GitHubLink } from "@/components/github-link";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { SiteHeaderLogo } from "@/components/site-header-logo";
import { ApiKeyManager } from "@/components/api-key-manager";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";
import { Separator } from "@elevenlabs/ui/components/separator";

export async function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className="bg-sidebar sticky top-0 z-50 w-full">
      <div className="container-wrapper 3xl:fixed:px-0 md:px-5">
        <div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
          <MobileNav
            tree={pageTree}
            items={siteConfig.navItems}
            className="flex lg:hidden"
          />
          <SiteHeaderLogo siteName={siteConfig.name} />

          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <MainNav items={siteConfig.navItems} className="hidden lg:flex" />
            <GitHubLink />
            <Separator orientation="vertical" />
            <ApiKeyManager />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
