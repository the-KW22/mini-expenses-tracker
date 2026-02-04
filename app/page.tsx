import {
  Header,
  Footer,
  Hero,
  ValuePropositions,
  HowItWorks,
  CoreFeatures,
  CTA,
} from "@/components/landing-page";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <ValuePropositions />
        <HowItWorks />
        <CoreFeatures />
        <CTA />
      </main>

      <Footer />
    </div>
    
  );
}
