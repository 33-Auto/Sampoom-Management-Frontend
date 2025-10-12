import { type PropsWithChildren, useEffect, useState } from "react";import { ModuleHeader } from "@/widgets/Header";const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const formattedTime = currentTime.toLocaleTimeString("ko-KR");

  const headerConfig = {
    moduleTitle: "삼삼오토",
    moduleDescription: `${formattedDate} ${formattedTime}`,
    moduleIcon: "ri-home-2-line",
    moduleColor: "bg-main-500",
  };

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />

      {children}
    </div>
  );
};

export default HomeLayout;
