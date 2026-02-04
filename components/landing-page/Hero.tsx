import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                {/* App Icon */}
                <div className="flex items-center justify-center size-20 rounded-2xl bg-primary shadow-lg mb-6">
                    <Wallet className="size-10 text-primary-foreground" />
                </div>

                {/* App Name */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
                    Mini Expenses Tracker
                </h1>

                {/* Tagline */}
                <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-xl">
                    Simple, intuitive expense tracking to help you stay on budget and take control of your finances.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild>
                    <Link href="/sign-up">Get Started Free</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                    <Link href="/sign-in">Sign In</Link>
                    </Button>
                </div>
                </div>
            </div>
        </section>
    )
}