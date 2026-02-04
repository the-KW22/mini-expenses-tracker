import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Calendar } from 'lucide-react';

interface ProfileInfoCardProps {
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-MY', {
    year: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export default function ProfileInfoCard({
  name,
  email,
  image,
  createdAt,
}: ProfileInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-16 w-16 text-lg shrink-0">
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback className="bg-primary/20 text-primary-dark text-xl font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {formatDate(createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
