import * as React from "react";

const Notfound: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-semibold text-gray-100 md:text-5xl">404</h1>
      <h1 className="mt-6 text-2xl font-semibold md:text-3xl">
        페이지를 찾을 수 없습니다.
      </h1>
      {/* <p className="mt-4 text-xl text-gray-500 md:text-2xl">
        Tell me what you would like on this page
      </p> */}
    </div>
  );
};

export { Notfound };
