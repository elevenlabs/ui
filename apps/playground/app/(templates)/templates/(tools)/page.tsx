import { ToolCard } from '@/components/tool-card';
import toolsRegistry from '@/registry/tools-registry.json';

export const dynamic = 'force-static';
export const revalidate = false;

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
  const tools = await Promise.all(
    toolsRegistry.tools.map(async toolName => {
      const tool = await loadTool(toolName);
      return tool ? { ...tool, id: toolName } : null;
    }),
  );

  const validTools = tools.filter(Boolean);

  const toolsByCategory = toolsRegistry.categories
    .map(category => {
      const categoryTools = validTools.filter(
        tool => tool?.category === category.id,
      );
      return {
        ...category,
        tools: categoryTools,
      };
    })
    .filter(category => category.tools.length > 0);
  return (
    <div className="flex flex-col gap-12 md:gap-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
