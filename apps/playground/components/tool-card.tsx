'use client';

import { useState } from 'react';
import { Button } from '@elevenlabs/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@elevenlabs/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@elevenlabs/ui/components/dialog';
import { Input } from '@elevenlabs/ui/components/input';
import { Label } from '@elevenlabs/ui/components/label';
import { Badge } from '@elevenlabs/ui/components/badge';
import { Separator } from '@elevenlabs/ui/components/separator';
import {
  Search,
  ExternalLink,
  Plus,
  CheckCircle2,
  Loader2,
  ArrowRight,
  KeyRound,
  Shield,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search: Search,
};

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    display_name: string;
    description: string;
    category: string;
    icon?: string;
    tags?: string[];
    example_usage?: string;
    required_secrets?: Array<{
      name: string;
      description: string;
    }>;
  };
}

type AddToolStep = 'configure' | 'creating' | 'success';

export function ToolCard({ tool }: ToolCardProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [step, setStep] = useState<AddToolStep>('configure');
  const [creatingStage, setCreatingStage] = useState<
    'secrets' | 'tool' | 'done'
  >('secrets');
  const [error, setError] = useState<string | null>(null);

  const Icon = tool.icon ? iconMap[tool.icon] : null;

  const handleAddTool = async () => {
    setStep('creating');
    setCreatingStage('secrets');
    setError(null);

    try {
      const response = await fetch('/api/tools/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          secrets,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Wait a bit before transitioning to tool creation phase
        await new Promise(resolve => setTimeout(resolve, 500));
        setCreatingStage('tool');

        // Show tool creation for a bit
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCreatingStage('done');

        // Small delay before showing success
        await new Promise(resolve => setTimeout(resolve, 500));
        setStep('success');
      } else {
        console.error('Failed to add tool:', result);
        setError(result.error || 'Failed to add tool');
        setStep('configure');
      }
    } catch (error) {
      console.error('Error adding tool:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
      setStep('configure');
    }
  };

  const resetDialog = () => {
    setShowAddDialog(false);
    setTimeout(() => {
      setStep('configure');
      setCreatingStage('secrets');
      setSecrets({});
      setError(null);
    }, 200);
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="rounded-md bg-muted p-2">
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{tool.display_name}</CardTitle>
                <CardDescription className="mt-1">
                  {tool.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          {tool.example_usage && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Example:</span> {tool.example_usage}
            </div>
          )}
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tool.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex-1"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={resetDialog}>
        <DialogContent className="max-w-4xl p-0 gap-0">
          <DialogTitle className="sr-only">
            Add {tool.display_name} to your agent
          </DialogTitle>
          <div className="flex h-[600px]">
            {/* Left side - Configuration */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {Icon && <Icon className="h-6 w-6" />}
                    <h2 className="text-2xl font-semibold">
                      {tool.display_name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Features</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Real-time Integration</p>
                        <p className="text-sm text-muted-foreground">
                          Seamlessly integrates with your voice agent for
                          instant access
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Secure & Private</p>
                        <p className="text-sm text-muted-foreground">
                          Your API keys are encrypted and never shared
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {tool.required_secrets && tool.required_secrets.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">API Configuration</h3>
                      {tool.required_secrets.map(secret => (
                        <div key={secret.name} className="space-y-2">
                          <Label
                            htmlFor={secret.name}
                            className="flex items-center gap-2"
                          >
                            <KeyRound className="h-4 w-4" />
                            {secret.name}
                          </Label>
                          <Input
                            id={secret.name}
                            type="password"
                            placeholder={secret.description}
                            value={secrets[secret.name] || ''}
                            onChange={e =>
                              setSecrets(prev => ({
                                ...prev,
                                [secret.name]: e.target.value,
                              }))
                            }
                            disabled={step !== 'configure'}
                          />
                          <p className="text-sm text-muted-foreground">
                            {secret.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator orientation="vertical" className="h-full" />

            <div className="flex-1 bg-muted/30 p-6 flex flex-col">
              {step === 'configure' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Ready to add {tool.display_name}?
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Configure your API credentials and click Create to add
                      this tool to your agent
                    </p>
                  </div>
                  {error && (
                    <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                      {error}
                    </div>
                  )}
                  <Button
                    onClick={handleAddTool}
                    disabled={tool.required_secrets?.some(
                      s => !secrets[s.name],
                    )}
                    className="mt-4"
                  >
                    Create Tool
                  </Button>
                </div>
              )}

              {step === 'creating' && (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          creatingStage === 'secrets'
                            ? 'bg-primary/10'
                            : 'bg-primary',
                        )}
                      >
                        {creatingStage === 'secrets' ? (
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'font-medium',
                            creatingStage !== 'secrets' &&
                              'text-muted-foreground',
                          )}
                        >
                          Creating secure secrets
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Encrypting and storing your API credentials
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          creatingStage === 'tool'
                            ? 'bg-primary/10'
                            : creatingStage === 'done'
                              ? 'bg-primary'
                              : 'bg-muted',
                        )}
                      >
                        {creatingStage === 'tool' ? (
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : creatingStage === 'done' ? (
                          <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'font-medium',
                            creatingStage === 'secrets' &&
                              'text-muted-foreground',
                          )}
                        >
                          Adding tool to agent
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Configuring {tool.display_name} for your voice agent
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Tool added successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {tool.display_name} has been added to your agent and is
                      ready to use
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button asChild>
                      <a
                        href="https://elevenlabs.io/app/agents/tools"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        View in ElevenLabs
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" onClick={resetDialog}>
                      Add Another Tool
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
