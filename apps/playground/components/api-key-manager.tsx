'use client';

import { useState, useEffect } from 'react';
import { Key, Check, Loader2, User, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '@elevenlabs/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@elevenlabs/ui/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@elevenlabs/ui/components/dropdown-menu';
import { Avatar, AvatarFallback } from '@elevenlabs/ui/components/avatar';
import { Input } from '@elevenlabs/ui/components/input';
import { Label } from '@elevenlabs/ui/components/label';
import { toast } from 'sonner';

interface UserData {
  user_id: string;
  first_name?: string;
  subscription: {
    tier: string;
    character_count: number;
    character_limit: number;
  };
}

export function ApiKeyManager() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  // Check if API key is already stored and fetch user if it is
  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = async () => {
    try {
      const res = await fetch('/api/elevenlabs/auth');
      const data = await res.json();
      setHasStoredKey(data.hasApiKey);

      if (data.hasApiKey) {
        // Fetch user data if API key exists
        await fetchUserData();
      }
    } catch (error) {
      console.error('Failed to check API key status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const fetchUserData = async () => {
    setFetchingUser(true);
    try {
      const res = await fetch('/api/elevenlabs/user');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setFetchingUser(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey) {
      toast.error('Please enter your API key');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/elevenlabs/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save API key');
      }

      toast.success('API key saved securely');

      setHasStoredKey(true);
      setOpen(false);
      setApiKey('');

      // Fetch user data after saving key
      await fetchUserData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save API key',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      await fetch('/api/elevenlabs/auth', {
        method: 'DELETE',
      });

      toast.success('API key removed');

      setHasStoredKey(false);
      setUser(null);
    } catch (error) {
      toast.error('Failed to remove API key');
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.first_name) {
      return user.first_name.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUsagePercentage = () => {
    if (!user) return 0;
    return Math.round(
      (user.subscription.character_count / user.subscription.character_limit) *
        100,
    );
  };

  if (checkingStatus || fetchingUser) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  // If user is logged in, show avatar dropdown
  if (hasStoredKey && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.first_name || 'ElevenLabs User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {user.subscription.tier} tier
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
            className="flex items-center justify-between"
          >
            <a
              href="https://elevenlabs.io/app/developers/usage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Usage</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {getUsagePercentage()}%
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            {user.subscription.character_count.toLocaleString()} /{' '}
            {user.subscription.character_limit.toLocaleString()} characters
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://elevenlabs.io/app/developers/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Key className="mr-2 h-4 w-4" />
              Manage API Key
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClear} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Remove Key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default key icon button
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Key className="h-4 w-4" />
            {hasStoredKey && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ElevenLabs API Key</DialogTitle>
            <DialogDescription>
              {hasStoredKey
                ? 'Your API key is securely stored. You can update or remove it below.'
                : 'Add your ElevenLabs API key to enable voice features. Your key will be encrypted and stored securely.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!hasStoredKey ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk_..."
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key will be encrypted and stored securely. You can
                  remove it at any time.
                </p>
              </>
            ) : (
              <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">API key is configured</span>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            {hasStoredKey ? (
              <>
                <Button
                  variant="destructive"
                  onClick={handleClear}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Remove Key'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHasStoredKey(false);
                  }}
                >
                  Update Key
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setApiKey('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save Key'
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
