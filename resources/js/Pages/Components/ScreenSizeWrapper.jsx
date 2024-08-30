import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

export default function ScreenSizeWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50"> {/* Full height container */}
        <Card className="flex flex-col justify-center items-center text-center p-6 max-w-md">
          <Image
            src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif"
            alt="😞"
            width="32"
            height="32"
          />
          <CardHeader>
            <h1 className="text-xl font-extrabold">
              Sorry! Currently, it does not support small screen sizes as of now.
            </h1>
          </CardHeader>
          <CardBody>
            <p>
              Please try again with a larger device. We recommend using a laptop
              for the best experience possible.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
