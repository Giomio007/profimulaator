"use client";

import AboutSection from "@/components/AboutSection/AboutSection";
import Features from "@/components/Features/Features";
import Hero from "@/components/Hero/Hero";
import ServicesSectio from "@/components/ServicesSection/ServicesSectio";
import SimulatorSection from "@/components/Simulator/SimulatorSection";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <SimulatorSection />
      <Features />
      <ServicesSectio />
      <AboutSection />
    </main>
  );
};

export default HomePage;
