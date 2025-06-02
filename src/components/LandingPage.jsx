import React from "react";

const pets = [
  {
    id: 1,
    name: "Bella",
    image: "https://placedog.net/400/300?id=1",
    breed: "Labrador",
  },
  {
    id: 2,
    name: "Max",
    image: "https://placedog.net/400/300?id=2",
    breed: "German Shepherd",
  },
  {
    id: 3,
    name: "Luna",
    image: "https://placedog.net/400/300?id=3",
    breed: "Golden Retriever",
  },
];

const LandingPage = () => {
  return (
    <div className="font-sans">
      {/* Hero */}
      <header className="text-center py-16 bg-gray-100">
        <h2 className="text-4xl font-bold mb-4">Find Your New Best Friend 🐶</h2>
        <p className="text-lg text-gray-700 mb-6">
          Connecting adopters with loving shelters across the country.
        </p>
        <a href="/register" className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700 transition">
          Get Started
        </a>
      </header>

      {/* About Us */}
      <section id="about" className="py-12 px-4 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-700 leading-relaxed">
          PetAdopt is a platform designed to simplify the pet adoption process by connecting adopters with verified shelters. Whether you're looking for a playful puppy or a loyal senior dog, we're here to help make that connection.
        </p>
      </section>

      {/* Featured Pets */}
      <section className="py-12 px-4 max-w-6xl mx-auto bg-gray-50">
        <h3 className="text-2xl font-semibold mb-6">Featured Pets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="border rounded-lg p-4 bg-white shadow">
              <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover rounded" />
              <h4 className="text-lg font-bold mt-2">{pet.name}</h4>
              <p className="text-sm text-gray-600">{pet.breed}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-12 px-4 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
        <p className="text-gray-700 mb-2">
          📧 Email: support@petadopt.com
        </p>
        <p className="text-gray-700">
          📍 Location: Kathmandu, Nepal
        </p>
      </section>

      {/* Terms and Conditions */}
      <section className="py-12 px-4 max-w-4xl mx-auto text-sm text-gray-600 border-t">
        <h4 className="text-lg font-semibold mb-2">Terms & Conditions</h4>
        <p>
          By using this platform, you agree to follow proper adoption practices and treat pets with kindness. We work closely with shelters to ensure animals are placed in safe, loving homes.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4 bg-gray-100">
        &copy; {new Date().getFullYear()} PetAdopt. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
