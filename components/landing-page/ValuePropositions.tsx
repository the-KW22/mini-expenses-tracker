import { Bell, ArrowUpDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const propositions = [
  {
    icon: Bell,
    title: "Real-Time Budget Alerts",
    description: "Know when you're close to overspending.",
    details:
      "Get notified instantly when your spending approaches your budget limits, helping you make smarter financial decisions before it's too late.",
  },
  {
    icon: ArrowUpDown,
    title: "Track Income & Expenses",
    description: "Log both earnings and spending in one place.",
    details:
      "Manage income by source and expenses by category. See your complete financial picture with our dual-tracking system.",
  },
  {
    icon: TrendingUp,
    title: "Cash Flow Insights",
    description: "See your savings rate at a glance.",
    details:
      "Instantly view your net cash flow (income minus expenses) with visual indicators. Track your savings percentage and make smarter financial decisions.",
  },
];

export function ValuePropositions() {
  return (
    <section className="py-20 bg-surface-hover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Why Choose Mini Expenses Tracker?
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Unlike complex spreadsheets or bloated apps, we focus on what matters most: helping you track your money simply and effectively.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {propositions.map((item) => (
            <Card key={item.title} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <div className="flex items-center justify-center size-14 rounded-xl bg-primary/10">
                    <item.icon className="size-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-base font-medium text-text-secondary">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted text-sm">{item.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
