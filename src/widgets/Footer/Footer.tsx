import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              삼삼오토
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sampoom Management System
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} 삼삼오토. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="이용약관"
              >
                이용약관
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="개인정보처리방침"
              >
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
