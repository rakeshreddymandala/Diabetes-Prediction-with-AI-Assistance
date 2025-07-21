export default function DiabetesInfo() {
    const features = [
      { name: "Accurate Predictions", description: "AI-powered models analyze patient data for diabetes risk assessment." },
      { name: "Data-Driven Insights", description: "Uses medical datasets to provide reliable results." },
      { name: "User-Friendly Interface", description: "Designed for both medical professionals and individuals." },
      { name: "Fast Processing", description: "Generates predictions in real-time with minimal input." },
      { name: "Health Recommendations", description: "Personalized AI-generated health tips." },
    ];
  
    return (
      <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-4xl">My app is about</h1>
            <h3 className="text-3xl font-bold tracking-tight sm:text-3xl">Diabetes Prediction System</h3>
            <p className="mt-4 text-gray-300">
              Our AI-driven system predicts diabetes risks based on health parameters and provides expert recommendations.
            </p>
  
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.name} className="border-l-4 border-blue-400 pl-4">
                  <dt className="text-lg font-semibold">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-400">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="src\assets\Diabetes.jpg" alt="Diabetes test" className="rounded-lg shadow-lg" />
            <img src="src\assets\pic.webp" alt="AI Analysis" className="rounded-lg shadow-lg" />
            <img src="src\assets\AI.webp" alt="Medical insights" className="rounded-lg shadow-lg col-span-2" />
          </div>
        </div>
      </div>
    );
  }
  