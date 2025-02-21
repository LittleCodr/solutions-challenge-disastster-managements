import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import type { COBEOptions } from "cobe";
import { useDisasterStore } from '../store/disaster';

const defaultConfig: COBEOptions = {
  width: 1000,
  height: 1000,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.3, 0.3, 0.6],
  markerColor: [0.9, 0.4, 0.3],
  glowColor: [0.8, 0.3, 0],
  markers: [],
  opacity: 0.9,
};

export function Globe({
  className = "",
  config = defaultConfig,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const { disasters } = useDisasterStore();
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Convert disasters to markers with proper scaling and colors
  const markers = disasters
    .filter(disaster => disaster.location?.coordinates)
    .map(disaster => ({
      location: [disaster.location.coordinates[1], disaster.location.coordinates[0]], // Swap lat/lng for COBE
      size: Math.max(0.5, Math.min(1.5, disaster.severity * 0.3)), // Scale marker size based on severity
      color: getDisasterColor(disaster.type, disaster.severity),
    }));

  function getDisasterColor(type: string, severity: number): [number, number, number] {
    const alpha = 0.5 + (severity * 0.1); // Intensity based on severity
    switch (type) {
      case 'earthquake':
        return [1, 0.3, 0.2]; // Red
      case 'flood':
        return [0.2, 0.4, 1]; // Blue
      case 'hurricane':
        return [0.8, 0.8, 0.2]; // Yellow
      case 'tornado':
        return [0.6, 0.2, 0.8]; // Purple
      case 'wildfire':
        return [1, 0.5, 0]; // Orange
      case 'tsunami':
        return [0, 0.7, 0.9]; // Cyan
      default:
        return [1, 1, 1]; // White
    }
  }

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setRotation(delta / 200);
    }
  };

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) {
        phi += 0.005;
      }
      state.phi = phi + rotation;
      state.width = width * 2;
      state.height = width * 2;
    },
    [rotation],
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    window.addEventListener("resize", onResize);
    onResize();

    const globeConfig = {
      ...defaultConfig,
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
      markers,
    };

    const globe = createGlobe(canvasRef.current, globeConfig);

    // Add loading animation
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
        setIsLoading(false);
      }
    }, 500);

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [disasters, width]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-0 transition-opacity duration-500"
        style={{ 
          contain: "layout paint size",
          cursor: "grab"
        }}
        onPointerDown={(e) =>
          updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-3">
        <div className="text-xs text-white space-y-2">
          <div className="font-semibold mb-2">Disaster Types</div>
          {['earthquake', 'flood', 'hurricane', 'tornado', 'wildfire', 'tsunami'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  backgroundColor: `rgb(${getDisasterColor(type, 5).map(c => c * 255).join(',')})` 
                }}
              />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}