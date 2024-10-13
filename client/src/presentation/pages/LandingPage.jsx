import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pricing from "@/components/Pricing";

const Navbar = () => (
  <nav className="flex items-center justify-between p-4 bg-background text-forground">
    <div className="text-2xl font-bold">Team work</div>
    <div className="space-x-4">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="#about">About</a>
      <a href="#pricing">
        <Button variant="outline">Log in</Button>
      </a>
      <Button>Sign up</Button>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="py-20 text-center ">
    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
      Streamline Your Workflow
    </h1>
    <p className="text-xl mb-8 text-foreground ">
      Boost productivity with our intuitive project management tool
    </p>
    <a href="#pricing">
      <Button size="lg">
        Get Started <ArrowRight className="ml-2" />
      </Button>
    </a>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="py-20 dark:bg-slate-900">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-background p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.descripiton}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="dark:bg-gray-900 dark:text-white py-8">
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h4 className="text-lg font-semibold mb-4">Company</h4>
        <ul className="space-y-2">
          <li>About</li>
          <li>Careers</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-4">Product</h4>
        <ul className="space-y-2">
          <li>Features</li>
          <li>Pricing</li>
          <li>Documentation</li>
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-4">Resources</h4>
        <ul className="space-y-2">
          <li>Blog</li>
          <li>Help Center</li>
          <li>API</li>
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-4">Legal</h4>
        <ul className="space-y-2">
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Cookie Policy</li>
        </ul>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col  bg-background">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <Pricing id="pricing"></Pricing>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

const features = [
  {
    id: 1,
    title: "Task Management",
    descripiton: "Real time task update and more.",
  },
  {
    id: 2,
    title: "Team Collaboration",
    descripiton:
      "Any team member can update the state of task which is assaigned to him.",
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    descripiton: "interactive and information rich dashboard",
  },
];
