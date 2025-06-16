import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto">
      <div className="container mx-auto text-center">
        <div className="border-t border-teal-400 pt-4">
          <p className="text-teal-100 text-sm">
            &copy; {new Date().getFullYear()} PetConnect. All rights reserved. Made with ❤️ for pets in Pokhara, Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;