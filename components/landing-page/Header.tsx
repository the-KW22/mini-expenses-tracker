import { Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function Header(){
    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and App name */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-primary">
                            <Wallet className="size-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold text-text-primary">
                            Mini Expense Tracker
                        </span>
                    </Link>

                    {/* Nav Button */}
                    <nav className="flex items-center gap-3">
                        <Button variant="ghost" asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>

                        <Button asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}