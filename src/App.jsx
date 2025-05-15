import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import shortly from "../src/assets/images/logo.svg";
import branding from "../src/assets/images/icon-brand-recognition.svg";
import detailed from "../src/assets/images/icon-detailed-records.svg";
import customizable from "../src/assets/images/icon-fully-customizable.svg";
import facebook from "../src/assets/images/icon-facebook.svg";
import instagram from "../src/assets/images/icon-instagram.svg";
import pinterest from "../src/assets/images/icon-pinterest.svg";
import twitter from "../src/assets/images/icon-twitter.svg";
import worker from "../src/assets/images/illustration-working.svg";
import bgShortenDesktop from "../src/assets/images/bg-shorten-desktop.svg";
import bgboostDesktop from "../src/assets/images/bg-boost-desktop.svg";

export default function ShortlyApp() {
  const [url, setUrl] = useState("");
  const [shortenedLinks, setShortenedLinks] = useState(() => {
    const saved = localStorage.getItem("shortenedLinks");
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks));
  }, [shortenedLinks]);

  const shortenUrl = async () => {
    if (!url) {
      setError("Please add a link");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://cleanuri.com/api/v1/shorten?url=${encodeURIComponent(url)}`
      );
      setShortenedLinks([
        ...shortenedLinks,
        { original: url, short: response.data.result_url },
      ]);
      setUrl("");
    } catch {
      setError("Failed to shorten the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (index, shortLink) => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      alert("Failed to copy");
    }
  };

  const handleDelete = (indexToDelete) => {
    const newLinks = shortenedLinks.filter(
      (_, index) => index !== indexToDelete
    );
    setShortenedLinks(newLinks);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins] text-[18px] overflow-x-hidden">
      {/* NAVIGATION BAR */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-6">
          <img src={shortly} alt="Shortly logo" className="h-6" />
          <nav className="hidden md:flex gap-4 text-grayish-violet">
            <a href="#" className=" text-gray-600 hover:text-very-dark-blue">
              Features
            </a>
            <a href="#" className=" text-gray-600 hover:text-very-dark-blue">
              Pricing
            </a>
            <a href="#" className=" text-gray-600 hover:text-very-dark-blue">
              Resources
            </a>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="text-grayish-violet hover:text-very-dark-blue">
            Login
          </button>
          <button className="px-5 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto px-10 py-16">
        <div className="text-center gap-4 md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
            More than just shorter links
          </h1>
          <p className="text-gray-600 mt-4">
            Build your brand's recognition and get detailed insights on how your
            links are performing.
          </p>
          <button className="mt-6 px-8 py-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 ">
          <img src={worker} alt="Illustration working" className="w-full" />
        </div>
      </section>

      {/* Input Section */}
      <main className="bg-gray-200 py-16 px-4">
        <div className="relative max-w-4xl mx-auto -mt-20 z-10 px-6">
          <div
            className="bg-violet-900 bg-no-repeat bg-cover bg-center rounded-xl relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-4 md:gap-6 items-center shadow-lg"
            style={{ backgroundImage: `url(${bgShortenDesktop})` }}
          >
            <input
              type="url"
              placeholder="Shorten a link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`flex-1 w-full px-4 py-3 placeholder-gray-600 bg-white md:px-6 md:py-4 rounded-lg focus:outline-none text-base ${
                error ? "border-2 border-red-400 placeholder-gray-600" : ""
              }`}
            />
            <button
              onClick={shortenUrl}
              disabled={loading}
              className={`w-full md:w-auto px-6 py-3 md:px-10 md:py-4 font-bold rounded-lg transition-all duration-200 text-white ${
                loading
                  ? "bg-cyan-300 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {loading ? "Shortening..." : "Shorten It!"}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm italic mt-2 ml-2">{error}</p>
          )}
        </div>

        <div className="mt-10 space-y-6 max-w-4xl mx-auto">
          {shortenedLinks.map((link, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded shadow gap-4"
            >
              <p className="text-gray-800 w-full truncate sm:max-w-xs">
                {link.original}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={link.short}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600"
                >
                  {link.short}
                </a>
                <button
                  onClick={() => handleCopy(index, link.short)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none ${
                    copiedIndex === index
                      ? "bg-violet-900 text-white"
                      : "bg-cyan-500 text-white hover:bg-cyan-600"
                  }`}
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Statistics */}
        <section className="mt-24 text-center px-4">
          <h2 className="text-3xl font-bold">Advanced Statistics</h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Track how your links are performing across the web with our advanced
            statistics dashboard.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-8 rounded shadow text-left relative z-10">
              <img
                src={branding}
                alt="Brand Recognition"
                className="mb-6 w-16 h-16"
              />
              <h3 className="font-bold text-lg">Brand Recognition</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Boost your brand recognition with each click. Branded links help
                instill confidence in your content.
              </p>
            </div>
            <div className="bg-white p-8 rounded shadow text-left relative z-10 mt-8 md:mt-16">
              <img
                src={detailed}
                alt="Detailed Records"
                className="mb-6 w-16 h-16"
              />
              <h3 className="font-bold text-lg">Detailed Records</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Gain insights into who is clicking your links. Knowing when and
                where people engage helps inform better decisions.
              </p>
            </div>
            <div className="bg-white p-8 rounded shadow text-left relative z-10 mt-8 md:mt-32">
              <img
                src={customizable}
                alt="Fully Customizable"
                className="mb-6 w-16 h-16"
              />
              <h3 className="font-bold text-lg">Fully Customizable</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Improve brand awareness through customizable links,
                supercharging audience engagement.
              </p>
            </div>

            <div
              className="hidden md:block absolute top-1/2 left-0 right-0 h-2 bg-cyan-500 z-0"
              style={{ top: "50%" }}
            ></div>
          </div>
        </section>

        {/* Boost Section */}
        <div
          className="bg-violet-900 bg-no-repeat bg-cover bg-center text-white text-center py-16 px-4 rounded-lg p-6 mt-8"
          style={{ backgroundImage: `url(${bgboostDesktop})` }}
        >
          <h2 className="text-2xl font-bold">Boost your links today</h2>
          <button className="mt-6 px-8 py-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
          <div>
            <h3 className="font-bold text-white mb-3">Features</h3>
            <p className="mb-1">Link Shortening</p>
            <p className="mb-1">Branded Links</p>
            <p>Analytics</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Resources</h3>
            <p className="mb-1">Blog</p>
            <p className="mb-1">Developers</p>
            <p>Support</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Company</h3>
            <p className="mb-1">About</p>
            <p className="mb-1">Our Team</p>
            <p className="mb-1">Careers</p>
            <p>Contact</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-4 col-span-2 md:col-span-1 md:mt-0 mt-6">
            <img src={facebook} alt="Facebook" className="w-6 h-6" />
            <img src={twitter} alt="Twitter" className="w-6 h-6" />
            <img src={pinterest} alt="Pinterest" className="w-6 h-6" />
            <img src={instagram} alt="Instagram" className="w-6 h-6" />
          </div>
        </div>
      </footer>
    </div>
  );
}
