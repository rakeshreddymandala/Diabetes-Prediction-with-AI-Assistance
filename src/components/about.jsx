import { link } from "framer-motion/client";

const links = [
    { name: "Diabetes Prediction", href: "/prediction" },
    { name: "AI Assistance", href: "/ai-assistance" },
    { name: "Model Details", href: "/home#model-details" },
  ];
  
  const stats = [
    { name: "AI Accuracy", value: "92%" },
    { name: "Patients Analyzed", value: "50,000+" },
    { name: "Research Papers Used", value: "120+" },
    { name: "Real-time Assistance", value: "24/7" },
  ];
  
  export default function AboutSection() {
    return (
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-13 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              About Our Diabetes Prediction System
            </h2>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
              Our AI-driven platform helps predict diabetes risk based on user health data, providing accurate predictions
              and real-time medical assistance.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              {links.map((link) => (
                <a key={link.name} href={link.href} className="hover:text-blue-400 transition duration-300">
                  {link.name} <span aria-hidden="true">&rarr;</span>
                </a>
              ))}
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-col-reverse gap-1">
                  <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                  <dd className="text-4xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    );
  }
  