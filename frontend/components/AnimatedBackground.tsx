import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animated blob 1
    if (blob1Ref.current) {
      gsap.to(blob1Ref.current, {
        x: 200,
        y: -200,
        scale: 1.5,
        duration: 10,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // Animated blob 2
    if (blob2Ref.current) {
      gsap.to(blob2Ref.current, {
        x: -100,
        y: 100,
        scale: 1.3,
        duration: 12.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // Animated blob 3
    if (blob3Ref.current) {
      gsap.to(blob3Ref.current, {
        x: -50,
        y: 50,
        scale: 1.1,
        duration: 7.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated blob 1 */}
      <div
        ref={blob1Ref}
        className="absolute w-96 h-96 bg-gradient-to-r from-slate-500/30 to-blue-500/30 rounded-full blur-3xl"
        style={{ top: "10%", left: "10%" }}
      />

      {/* Animated blob 2 */}
      <div
        ref={blob2Ref}
        className="absolute w-96 h-96 bg-gradient-to-r from-slate-500/30 to-slate-500/30 rounded-full blur-3xl"
        style={{ bottom: "10%", right: "10%" }}
      />

      {/* Animated blob 3 */}
      <div
        ref={blob3Ref}
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-800/20 to-cyan-500/20 rounded-full blur-3xl"
        style={{ top: "50%", left: "50%" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(148, 163, 184) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148, 163, 184) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
