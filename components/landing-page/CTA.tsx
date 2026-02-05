import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 sm:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary-dark/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary-darker/30 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-primary-foreground/90 max-w-xl mb-8 text-lg">
              Track income, manage expenses, and watch your savings grow. Start your journey to better money management today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/sign-in">Sign In to Your Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
