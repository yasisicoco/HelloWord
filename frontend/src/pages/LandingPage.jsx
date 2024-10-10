import React from "react";
import Fullpage from "@fullpage/react-fullpage";
import landingImage1 from '../assets/landing/landing_image_1.png';
import landingImage2 from '../assets/landing/landing_image_2.png';
import landingImage3 from '../assets/landing/landing_image_3.png';

const images = [
  landingImage1,
  landingImage2,
  landingImage3,
];

const LandingPage = () => {
  return (
    <Fullpage
      scrollingSpeed={1000}
      render={({ fullpageApi }) => {
        return (
          <div>
            {images.map((src, index) => (
              <div key={index} className="section">
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100vh",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};

export default LandingPage;
