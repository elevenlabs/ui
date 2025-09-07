import { Metadata } from 'next';
import { ToolCard } from '@/components/tool-card';
import toolsRegistry from '@/registry/tools-registry.json';

export const metadata: Metadata = {
  title: 'Agent Tools - ElevenLabs',
  description: 'Powerful tools and integrations for ElevenLabs voice agents',
};

async function loadTool(toolName: string) {
  try {
    const tool = await import(`@/registry/tools/${toolName}.json`);
    return tool.default;
  } catch (error) {
    console.error(`Failed to load tool: ${toolName}`, error);
    return null;
  }
}

export default async function ToolsPage() {
  // Load all tools
  const tools = await Promise.all(
    toolsRegistry.tools.map(async (toolName) => {
      const tool = await loadTool(toolName);
      return tool ? { ...tool, id: toolName } : null;
    })
  );

  const validTools = tools.filter(Boolean);

  // Group tools by category
  const toolsByCategory = toolsRegistry.categories.map(category => {
    const categoryTools = validTools.filter(tool => tool?.category === category.id);
    return {
      ...category,
      tools: categoryTools
    };
  }).filter(category => category.tools.length > 0);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-background">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-16 md:py-20 lg:py-24">
            <h1 className="tracking-tight text-balance text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl text-foreground">
              Agent Tools
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Extend your voice agents with powerful integrations and tools. 
              Each tool comes pre-configured with best practices for voice interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] space-y-12">
          {toolsByCategory.map((category) => (
            <div key={category.id}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}