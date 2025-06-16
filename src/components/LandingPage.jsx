import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard"; // Adjust the path as needed
import { Heart, MapPin, Mail, Phone, Star, ArrowRight, Shield, Users, PawPrint } from "lucide-react";

const LandingPage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/pets", {
          params: { limit: 6 }, // Fetch 3 pets for the featured section
        });
        setFeaturedPets(res.data.pets);
      } catch (err) {
        console.error("Failed to fetch featured pets:", err);
        setError("Failed to load featured pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, []);

    const stats = [
    { icon: Heart, number: "500+", label: "Happy Adoptions" },
    { icon: Users, number: "100+", label: "Partner Shelters" },
    { icon: PawPrint, number: "500+", label: "Pets Rescued" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Shelters",
      description: "All our partner shelters are thoroughly vetted and verified for quality care."
    },
    {
      icon: Heart,
      title: "Perfect Matches",
      description: "Our smart matching system helps you find the perfect companion for your lifestyle."
    },
    {
      icon: Users,
      title: "Ongoing Support",
      description: "Get continued support and resources throughout your pet's adoption journey."
    }
  ];

  return (
     <div className="font-sans min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-blue-200/30 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-16 left-1/4 w-12 h-12 bg-purple-200/30 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-4">
                🏆 Nepal's #1 Pet Adoption Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Find Your New
              <br />
              <span className="relative">
                Best Friend
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-teal-300/50 to-blue-300/50 rounded-full transform -rotate-1"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connecting loving families with adorable pets across Nepal. 
              <span className="font-semibold text-teal-600"> Start your journey today!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href="/register" className="group bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-teal-600 hover:to-blue-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Pets */}
  
       <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Meet Your Future Best Friend
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                These adorable pets are looking for their forever homes. Could one of them be perfect for you?
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-500 rounded-full animate-spin" style={{borderRightColor: 'transparent', borderTopColor: 'transparent'}}></div>
                </div>
                <span className="ml-4 text-lg text-gray-600">Loading amazing pets...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-500 text-lg font-medium">{error}</p>
              </div>
            ) : featuredPets.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <PawPrint className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No featured pets available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPets.map((pet) => (
                  <PetCard
                    key={pet._id}
                    pet={pet}
                    showFavoriteButton={false}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-2xl hover:from-teal-600 hover:to-blue-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                View All Available Pets
              </button>
            </div>
          </div>
        </div>
      </section>


       {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                Why Choose PetAdopt?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to making pet adoption safe, easy, and joyful for everyone involved.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

       {/* About Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Our Mission: Creating 
                  <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"> Perfect Matches</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  PetAdopt was founded with a simple belief: every pet deserves a loving home, and every family deserves the perfect companion. We've created Nepal's most trusted platform to make these connections happen.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Working with verified shelters across the country, we ensure that every adoption is safe, ethical, and brings joy to both pets and their new families.
                </p>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 border-2 border-white"></div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Trusted by 500+ families</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-blue-200 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=400&fit=crop" 
                    alt="Happy pet adoption" 
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-teal-600">100%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


       {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600">
                Have questions? We're here to help you find your perfect companion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Email Us</h3>
                    <p className="text-gray-600">support@petadopt.com</p>
                  </div>
                </div>
              </div>

              {/* NEW Phone Contact Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <Phone className="w-6 h-6 text-white" /> {/* Used the Phone icon */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Call Us</h3>
                    <p className="text-gray-600">+977 9766695201</p> {/* Placeholder phone number */}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 md:col-span-2"> {/* Made map span 2 columns on medium screens */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Visit Us</h3>
                    <p className="text-gray-600">Pokhara, Nepal</p>
                    <div className="mt-4 rounded-xl overflow-hidden aspect-w-16 aspect-h-9 w-full"> {/* Aspect ratio div for responsiveness */}
                      <iframe
                        title="Pokhara, Nepal Map" // Added a meaningful title
                        width="100%"
                        height="300" // Height might be overridden by aspect-h-9
                        frameBorder="0" // Corrected to camelCase
                        scrolling="no"
                        marginHeight="0" // Corrected to camelCase
                        marginWidth="0" // Corrected to camelCase
                        src="https://maps.google.com/maps?q=28.2097,83.9853&hl=en&z=12&output=embed"
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pet?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy families who found their best friends through PetAdopt.
          </p>
          <a href="/register" className="bg-white text-teal-600 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Your Journey Today
          </a>
        </div>
      </section>

      {/* Footer */}
     <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                  PetAdopt
                </h3>
                <p className="text-gray-300 mb-4 max-w-md">
                  Connecting loving families with adorable pets across Nepal. Making adoption safe, easy, and joyful.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <p><a href="#" className="text-gray-300 hover:text-white transition-colors">Browse Pets</a></p>
                  <p><a href="#" className="text-gray-300 hover:text-white transition-colors">For Shelters</a></p>
                  <p><a href="#" className="text-gray-300 hover:text-white transition-colors">Success Stories</a></p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2">
                  <p><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></p>
                  <p><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></p>
                  <p><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Privacy</a></p>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;