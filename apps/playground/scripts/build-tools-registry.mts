import { promises as fs } from 'fs';
import path from 'path';
import { rimraf } from 'rimraf';

async function buildToolsRegistry() {
  console.log('🔧 Building tools registry...');

  const toolsRegistryPath = path.join(process.cwd(), 'registry/tools-registry.json');
  const toolsDir = path.join(process.cwd(), 'registry/tools');
  const outputDir = path.join(process.cwd(), 'public/r/tools');

  // Load the tools registry
  const registryContent = await fs.readFile(toolsRegistryPath, 'utf-8');
  const registry = JSON.parse(registryContent);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Copy the main registry file
  await fs.copyFile(toolsRegistryPath, path.join(outputDir, 'registry.json'));

  // Copy each tool JSON file
  for (const toolName of registry.tools) {
    const toolPath = path.join(toolsDir, `${toolName}.json`);
    const outputPath = path.join(outputDir, `${toolName}.json`);
    
    try {
      await fs.copyFile(toolPath, outputPath);
      console.log(`  ✓ Copied ${toolName}.json`);
    } catch (error) {
      console.error(`  ✗ Failed to copy ${toolName}.json:`, error);
    }
  }

  // Create an index file for easy access
  const index = {
    registry,
    tools: {},
  };

  for (const toolName of registry.tools) {
    try {
      const toolContent = await fs.readFile(
        path.join(toolsDir, `${toolName}.json`),
        'utf-8'
      );
      index.tools[toolName] = JSON.parse(toolContent);
    } catch (error) {
      console.error(`Failed to read tool ${toolName}:`, error);
    }
  }

  await fs.writeFile(
    path.join(outputDir, 'index.json'),
    JSON.stringify(index, null, 2)
  );

  console.log(`✅ Built tools registry with ${registry.tools.length} tools`);
}

// Run the build
buildToolsRegistry().catch((error) => {
  console.error('Failed to build tools registry:', error);
  process.exit(1);
});