import { UserPlus, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Create an Account",
    description:
      "Sign up in seconds with just your email. No credit card required, no complicated setup process.",
  },
  {
    number: 2,
    icon: Target,
    title: "Set Your Monthly Budget",
    description:
      "Set your monthly budget and add income sources. Adjust anytime as your financial situation changes.",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "Track, Analyze & Save",
    description:
      "Log income and expenses, view visual charts, and receive alerts when approaching your budget limit.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Get started in three simple steps and take control of your finances today.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line (hidden on mobile and after last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[65%] w-[80%] h-0.5 bg-border-light" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step number with icon */}
                <div className="relative mb-6">
                  <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 border-2 border-primary">
                    <step.icon className="size-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
