'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { deleteAccountAction } from '@/actions/profile.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function DeleteAccountSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteAccountAction();

      if (result.success) {
        // Reset theme to default before redirecting
        setTheme('sage');
        toast.success(result.message);
        router.push('/');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setConfirmText('');
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-base font-medium text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible and destructive actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="font-medium text-sm">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete Account
                </DialogTitle>
                <DialogDescription className="text-left pt-2 space-y-2">
                  <span className="block">
                    This action is <strong>permanent and cannot be undone</strong>.
                    All your data will be deleted including:
                  </span>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>All expenses and income records</li>
                    <li>All budgets</li>
                    <li>All categories and income sources</li>
                    <li>Your account information</li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <Label htmlFor="confirm">
                  Type <span className="font-mono font-bold">DELETE</span> to confirm
                </Label>
                <Input
                  id="confirm"
                  placeholder="DELETE"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setConfirmText('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading || confirmText !== 'DELETE'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
