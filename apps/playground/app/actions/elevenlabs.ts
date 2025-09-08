'use server';

import { cookies } from 'next/headers';
import { decryptApiKey } from '@/lib/crypto';

interface CreateSecretResponse {
  type: string;
  secret_id: string;
  name: string;
}

interface CreateToolResponse {
  id: string;
  tool_config: any;
  access_info: {
    is_creator: boolean;
    creator_name: string;
    creator_email: string;
    role: string;
  };
  usage_stats: {
    avg_latency_secs: number;
    total_calls: number;
  };
}

async function getStoredApiKey(): Promise<string> {
  const cookieStore = await cookies();
  const encryptedKey = cookieStore.get('el_session')?.value;

  if (!encryptedKey) {
    throw new Error(
      'No ElevenLabs API key found. Please add your API key using the key icon in the header.',
    );
  }

  const apiKey = await decryptApiKey(encryptedKey);
  return apiKey;
}

export async function createSecret(
  name: string,
  value: string,
): Promise<CreateSecretResponse> {
  const apiKey = await getStoredApiKey();

  console.log('[createSecret] Starting with name:', name);
  console.log('[createSecret] API Key retrieved from session');

  if (!apiKey) {
    throw new Error('No ElevenLabs API key found');
  }

  const requestBody = {
    type: 'new',
    name,
    value,
  };

  console.log('[createSecret] Request body:', { ...requestBody, value: '***' });

  const response = await fetch('https://api.elevenlabs.io/v1/convai/secrets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[createSecret] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[createSecret] Error response:', errorText);

    try {
      const error = JSON.parse(errorText);
      throw new Error(
        error.message || `Failed to create secret: ${response.status}`,
      );
    } catch {
      throw new Error(
        `Failed to create secret: ${response.status} - ${errorText}`,
      );
    }
  }

  const result = await response.json();
  console.log('[createSecret] Success:', result);
  return result;
}

export async function createTool(toolConfig: any): Promise<CreateToolResponse> {
  const apiKey = await getStoredApiKey();

  console.log(
    '[createTool] Starting with config:',
    JSON.stringify(toolConfig, null, 2),
  );
  console.log('[createTool] API Key retrieved from session');

  if (!apiKey) {
    throw new Error('No ElevenLabs API key found');
  }

  const requestBody = {
    tool_config: toolConfig,
  };

  console.log(
    '[createTool] Request body:',
    JSON.stringify(requestBody, null, 2),
  );

  const response = await fetch('https://api.elevenlabs.io/v1/convai/tools', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  console.log('[createTool] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[createTool] Error response:', errorText);

    try {
      const error = JSON.parse(errorText);
      throw new Error(
        error.message || `Failed to create tool: ${response.status}`,
      );
    } catch {
      throw new Error(
        `Failed to create tool: ${response.status} - ${errorText}`,
      );
    }
  }

  const result = await response.json();
  console.log('[createTool] Success:', result);
  return result;
}

export async function addToolWithSecrets(
  toolId: string,
  secrets: Record<string, string>,
): Promise<{ toolId: string; message: string }> {
  console.log('[addToolWithSecrets] Starting for tool:', toolId);
  console.log('[addToolWithSecrets] Secrets provided:', Object.keys(secrets));

  try {
    // Load the tool configuration
    const toolModule = await import(`@/registry/tools/${toolId}.json`);
    const tool = toolModule.default;

    console.log('[addToolWithSecrets] Tool loaded:', tool.name);

    if (!tool) {
      throw new Error('Tool not found');
    }

    // Create secrets first
    const secretIds: Record<string, string> = {};

    if (tool.required_secrets && secrets) {
      console.log(
        '[addToolWithSecrets] Creating secrets for:',
        tool.required_secrets.map((s: any) => s.name),
      );

      for (const requiredSecret of tool.required_secrets) {
        const secretValue = secrets[requiredSecret.name];
        if (!secretValue) {
          throw new Error(`Missing required secret: ${requiredSecret.name}`);
        }

        console.log(
          '[addToolWithSecrets] Creating secret:',
          requiredSecret.name,
        );

        const secretResponse = await createSecret(
          `${toolId}_${requiredSecret.name}`,
          secretValue,
        );

        secretIds[requiredSecret.name] = secretResponse.secret_id;
        console.log(
          '[addToolWithSecrets] Secret created with ID:',
          secretResponse.secret_id,
        );
      }
    }

    // Prepare the tool configuration with transformations
    const toolConfig = { ...tool };

    // Transform the tool configuration to match API expectations
    // 1. Fix force_pre_tool_speech
    if (toolConfig.force_pre_tool_speech === 'auto') {
      toolConfig.force_pre_tool_speech = false;
    }

    // 2. Convert empty arrays to proper schema objects
    if (Array.isArray(toolConfig.api_schema?.path_params_schema)) {
      toolConfig.api_schema.path_params_schema = {};
    }

    if (Array.isArray(toolConfig.api_schema?.query_params_schema)) {
      // Remove query_params_schema if it's an empty array
      delete toolConfig.api_schema.query_params_schema;
    } else if (
      toolConfig.api_schema?.query_params_schema?.properties &&
      typeof toolConfig.api_schema.query_params_schema.properties ===
        'object' &&
      Object.keys(toolConfig.api_schema.query_params_schema.properties)
        .length === 0
    ) {
      // Remove if properties is empty
      delete toolConfig.api_schema.query_params_schema;
    }

    // 3. Transform request_body_schema properties from array to object
    if (
      toolConfig.api_schema?.request_body_schema?.properties &&
      Array.isArray(toolConfig.api_schema.request_body_schema.properties)
    ) {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const prop of toolConfig.api_schema.request_body_schema.properties) {
        const propDef: any = {
          type: prop.type,
          description: prop.description || '',
        };

        // Add value fields if present
        if (prop.value_type) {
          propDef.value_type = prop.value_type;
        }
        if (prop.constant_value !== undefined && prop.constant_value !== '') {
          propDef.constant_value = prop.constant_value;
        }
        if (
          prop.dynamic_variable !== undefined &&
          prop.dynamic_variable !== ''
        ) {
          propDef.dynamic_variable = prop.dynamic_variable;
        }

        // Handle array items
        if (prop.type === 'array' && prop.items) {
          propDef.items = {
            type: prop.items.type,
          };

          // Convert nested properties from array to object
          if (prop.items.properties && Array.isArray(prop.items.properties)) {
            const itemProps: Record<string, any> = {};
            const itemRequired: string[] = [];

            for (const itemProp of prop.items.properties) {
              const itemPropDef: any = {
                type: itemProp.type,
                description: itemProp.description || '',
              };

              // Only add value_type to string types, not objects
              if (itemProp.type === 'string' && itemProp.value_type) {
                itemPropDef.value_type = itemProp.value_type;
              }
              if (
                itemProp.constant_value !== undefined &&
                itemProp.constant_value !== ''
              ) {
                itemPropDef.constant_value = itemProp.constant_value;
              }
              if (
                itemProp.dynamic_variable !== undefined &&
                itemProp.dynamic_variable !== ''
              ) {
                itemPropDef.dynamic_variable = itemProp.dynamic_variable;
              }

              itemProps[itemProp.id] = itemPropDef;

              if (itemProp.required) {
                itemRequired.push(itemProp.id);
              }
            }

            propDef.items.properties = itemProps;
            if (itemRequired.length > 0) {
              propDef.items.required = itemRequired;
            }
          }

          // Remove value_type from array property level (only allowed in items)
          delete propDef.value_type;
        }

        properties[prop.id] = propDef;

        if (prop.required) {
          required.push(prop.id);
        }
      }

      // Update request_body_schema
      toolConfig.api_schema.request_body_schema = {
        type: 'object',
        properties,
        required,
        description:
          toolConfig.api_schema.request_body_schema.description || '',
      };
    }

    // 4. Convert request_headers from array to object
    if (tool.required_secrets && secretIds) {
      const headers: Record<string, any> = {};

      for (const secret of tool.required_secrets) {
        headers[secret.header_name] = {
          type: 'secret',
          secret_id: secretIds[secret.name],
        };
      }

      toolConfig.api_schema.request_headers = headers;
      console.log(
        '[addToolWithSecrets] Updated request headers with secret IDs',
      );
    } else if (Array.isArray(toolConfig.api_schema?.request_headers)) {
      // Convert array to object if no secrets
      toolConfig.api_schema.request_headers = {};
    }

    // Remove fields that aren't part of the API schema
    delete toolConfig.required_secrets;
    delete toolConfig.display_name;
    delete toolConfig.category;
    delete toolConfig.icon;
    delete toolConfig.example_usage;
    delete toolConfig.tags;

    console.log('[addToolWithSecrets] Creating tool with transformed config');

    // Create the tool
    const toolResponse = await createTool(toolConfig);

    console.log(
      '[addToolWithSecrets] Tool created successfully:',
      toolResponse.id,
    );

    return {
      toolId: toolResponse.id,
      message: 'Tool created successfully',
    };
  } catch (error) {
    console.error('[addToolWithSecrets] Error:', error);
    throw error;
  }
}
