function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <InfoBox />
    </div>
  );
}

function InfoBox() {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border border-gray-500 
                    w-full sm:w-2/3 mx-auto mt-10">
      <h2 className="text-xl font-bold">Welcome to MyApp</h2>
      <p className="mt-2 text-gray-300">
        This is the best platform for AI-powered predictions and assistance.
      </p>
    </div>
  );
}

export default HomePage;