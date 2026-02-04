import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
            <Wallet className="h-6 w-6 text-primary-dark" />
          </div>
          <div>
            <h3 className="font-semibold">Mini Expenses Tracker</h3>
            <p className="text-sm text-muted-foreground">Version 0.1.0</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          A simple and intuitive expense tracking application to help you manage your finances,
          track spending habits, and stay on top of your budget goals.
        </p>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
