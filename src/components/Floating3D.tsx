import { useEffect, useState } from "react";

const Floating3D = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
      
      {/* Animated 3D Image Container */}
      <div 
        className={`floating-3d-container transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          maxWidth: '460px',
          margin: 'auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <img 
          src="/assets/11645585.jpg" 
          alt="3D Floating Element"
          className="floating-3d-image w-full h-auto rounded-2xl"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25))',
          }}
        />
      </div>

      <style>{`
        @keyframes float3d {
          0%, 100% {
            transform: perspective(1000px) rotateZ(-4deg) rotateY(-8deg) translateY(0px);
          }
          25% {
            transform: perspective(1000px) rotateZ(-4deg) rotateY(8deg) translateY(-12px);
          }
          50% {
            transform: perspective(1000px) rotateZ(-4deg) rotateY(8deg) translateY(-6px);
          }
          75% {
            transform: perspective(1000px) rotateZ(-4deg) rotateY(-8deg) translateY(-12px);
          }
        }

        .floating-3d-image {
          animation: float3d 7s ease-in-out infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* Responsive sizing */
        @media (max-width: 1024px) {
          .floating-3d-container {
            max-width: 320px !important;
          }
        }

        @media (max-width: 640px) {
          .floating-3d-container {
            max-width: 240px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Floating3D;
