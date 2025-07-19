"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-serif font-bold text-emerald-600">
          FontGroup
        </div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
            <a href="#" className="hover:text-emerald-600">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-600">
              GitHub Task 1
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-600">
              GitHub Task 2
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-emerald-600">
              2nd Task Link
            </a>
          </li>
        </ul>

        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 px-4 py-4 text-gray-700 font-medium">
            <li>
              <a href="#" className="hover:text-emerald-600">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-600">
                GitHub Task 1
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-600">
                Github Task 2
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-600">
                2nd Task Link
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
