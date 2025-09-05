'use client';

import { useEffect, useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { Button } from '@elevenlabs/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@elevenlabs/ui/components/card';
import { useElevenLabs } from '@/hooks/use-elevenlabs';
import { toast } from 'sonner';

export function ElevenLabsUserInfo() {
  const { user, loading, fetchUser, checkApiKey } = useElevenLabs();
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkApiKey().then(setHasKey);
  }, [checkApiKey]);

  const handleFetchUser = async () => {
    try {
      await fetchUser();
      toast.success('User data fetched successfully');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  if (!hasKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ElevenLabs Account</CardTitle>
          <CardDescription>
            Please configure your API key first using the key icon in the header
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ElevenLabs Account</CardTitle>
        <CardDescription>Your ElevenLabs account information</CardDescription>
      </CardHeader>
      <CardContent>
        {!user ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click below to fetch your account information
            </p>
            <Button onClick={handleFetchUser} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Fetch User Info
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Subscription Tier</p>
              <p className="text-sm text-muted-foreground capitalize">
                {user.subscription.tier}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Character Usage</p>
              <p className="text-sm text-muted-foreground">
                {user.subscription.character_count.toLocaleString()} /{' '}
                {user.subscription.character_limit.toLocaleString()}
              </p>
            </div>
            <Button variant="outline" onClick={fetchUser} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
