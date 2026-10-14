import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        {/* 좁은 화면에서는 세로로 쌓고, 각 덩어리 안에서는 줄바꿈하지 않는다 */}
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-wrap items-baseline justify-center gap-x-2">
            <h3 className="text-lg font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">
              삼삼오토
            </h3>
            <span className="text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
              Sampoom Management System
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-sm text-gray-600 sm:flex-row sm:gap-6 dark:text-gray-400">
            <span className="whitespace-nowrap">
              © {currentYear} 삼삼오토. All rights reserved.
            </span>
            <div className="flex items-center gap-4 whitespace-nowrap">
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
