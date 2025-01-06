import Hero from "@/components/pages/hero"
import FeatureCards from "@/components/pages/feature-cards"
import Features from "@/components/pages/features"
import HowItWorks from "@/components/pages/how-it-works"
import Stats from "@/components/pages/stats"
import CallToAction from "@/components/pages/cta"

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <Stats />
      <Features />
      <CallToAction />
    </main>
  )
}
