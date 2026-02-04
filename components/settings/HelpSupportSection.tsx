import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

const helpItems = [
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Find answers to common questions',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Learn how to use the app',
    href: '#',
  },
  {
    icon: MessageCircle,
    title: 'Contact Support',
    description: 'Get help from our team',
    href: 'mailto:the.kw22me@gmail.com',
  },
];

export default function HelpSupportSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Help & Support</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {helpItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </CardContent>
    </Card>
  );
}
