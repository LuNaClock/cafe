// src/components/Layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">MY RECIPE BOX &copy; {new Date().getFullYear()} - 個人用レシピ管理アプリ</p>
          </div>
          
          <div>
            <ul className="flex space-x-4">
              <li>
                <a href="#help" className="text-sm hover:text-orange-300 transition-colors">ヘルプ</a>
              </li>
              <li>
                <a href="#privacy" className="text-sm hover:text-orange-300 transition-colors">プライバシー</a>
              </li>
              <li>
                <a href="#terms" className="text-sm hover:text-orange-300 transition-colors">利用規約</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;