import {
  FolderTree,
  Gauge,
  BarChart,
  LayoutDashboard,
  Check,
  Wallet,
  PieChart,
} from "lucide-react";

const features = [
  {
    icon: FolderTree,
    title: "Category & Subcategory Tracking",
    description: "Organize expenses by categories and subcategories for detailed insights.",
  },
  {
    icon: Gauge,
    title: "Monthly Budget Limits",
    description: "Set and manage your monthly spending limits to keep your finances on track.",
  },
  {
    icon: Wallet,
    title: "Income Tracking",
    description: "Track all your income sources with custom categories, icons, and colors.",
  },
  {
    icon: BarChart,
    title: "Visual Budget Progress Bars",
    description: "See your spending progress at a glance with intuitive visual indicators.",
  },
  {
    icon: PieChart,
    title: "Visual Charts & Analytics",
    description: "Pie charts for category breakdown and trend charts for daily spending patterns.",
  },
  {
    icon: LayoutDashboard,
    title: "Simple Dashboard Without Clutter",
    description: "A clean, focused interface that shows exactly what you need - nothing more, nothing less.",
  },
];

export function CoreFeatures() {
  return (
    <section className="py-20 bg-surface-hover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Core Features
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Everything you need to manage your finances effectively, without the complexity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-5 rounded-xl bg-surface hover:shadow-md transition-shadow"
              >
                <div className="shrink-0">
                  <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
                    <feature.icon className="size-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional benefit */}
          <div className="mt-8 flex items-center justify-center gap-2 text-text-secondary">
            <Check className="size-5 text-primary" />
            <span>Free to use, no hidden fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
