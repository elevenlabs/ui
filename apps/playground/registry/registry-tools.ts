import { z } from 'zod';

// Tool schema definition
export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string().optional(),
  schema: z.object({
    input: z.record(z.any()),
    output: z.record(z.any()),
  }),
  config: z.object({
    apiKeyRequired: z.boolean().optional(),
    endpoint: z.string().optional(),
    rateLimit: z.string().optional(),
    scopes: z.array(z.string()).optional(),
    providers: z.array(z.string()).optional(),
    supportedDatabases: z.array(z.string()).optional(),
    readOnly: z.boolean().optional(),
    vectorDatabase: z.string().optional(),
    embeddingModel: z.string().optional(),
  }).optional(),
  examples: z.array(z.object({
    input: z.record(z.any()),
    output: z.record(z.any()),
  })).optional(),
});

export type Tool = z.infer<typeof toolSchema>;

// Tools registry type
export const toolsRegistrySchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  homepage: z.string(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  })),
  tools: z.array(z.string()),
});

export type ToolsRegistry = z.infer<typeof toolsRegistrySchema>;