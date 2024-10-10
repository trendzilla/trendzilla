import React, { useState } from "react";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import emailjs from "emailjs-com"; 

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

   
    const serviceID = "service_j8l7sa8";  
    const templateID = "template_8v5tstv"; 
    const publicKey = "rUA_xNafHAHpAOQdj"; 

    const templateParams = {
      user_email: email, 
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("Email successfully sent!", response.status, response.text);
        setMessage("You are now subscribed to our latest updates!");
        setEmail(""); 
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
        setMessage("Failed to subscribe. Please try again later.");
      });
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Logo and Social Media Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">TrendZilla</h2>
            <p className="text-sm mb-6">Follow us on Social Media</p>
            <div className="flex space-x-4">
              <a href="/" onClick={(e) => e.preventDefault()}>
                <FiFacebook
                  size={24}
                  className="hover:text-gray-400 transition-colors"
                />
              </a>
              <a href="/" onClick={(e) => e.preventDefault()}>
                <FiTwitter
                  size={24}
                  className="hover:text-gray-400 transition-colors"
                />
              </a>
              <a href="/" onClick={(e) => e.preventDefault()}>
                <FiInstagram
                  size={24}
                  className="hover:text-gray-400 transition-colors"
                />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  News
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-gray-400 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-4">STAY UP TO DATE</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 w-full rounded-md text-gray-900"
                required
              />
              <button
                type="submit"
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors w-full"
              >
                SUBMIT
              </button>
            </form>
            {message && <p className="mt-2 text-sm">{message}</p>}{" "}
            {/* Show feedback message */}
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6">
          <p className="text-sm">
            © {new Date().getFullYear()} TrendZilla. All rights reserved.
          </p>
          <div className="space-x-6">
            <a
              href="/"
              onClick={(e) => e.preventDefault()}
              className="text-sm hover:text-gray-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="/"
              onClick={(e) => e.preventDefault()}
              className="text-sm hover:text-gray-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/"
              onClick={(e) => e.preventDefault()}
              className="text-sm hover:text-gray-400 transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
