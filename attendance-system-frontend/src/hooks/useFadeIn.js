// src/hooks/useFadeIn.js

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A custom React hook for a simple fade-in and slide-up animation using GSAP.
 * @param {number} delay - Optional delay in seconds before the animation starts.
 * @param {number} duration - Optional duration of the animation in seconds.
 * @returns A ref object to be attached to the target DOM element.
 */
const useFadeIn = (delay = 0, duration = 0.5) => {
  // Create a ref. A ref can hold a reference to a DOM element.
  const elementRef = useRef(null);

  // useEffect runs after the component mounts (i.e., after the element is in the DOM).
  useEffect(() => {
    // Ensure the element has been rendered before trying to animate it.
    if (elementRef.current) {
      // Use GSAP to animate the element.
      // 'from' sets the initial state of the animation.
      // The 'to' state is implied to be the element's default CSS state.
      gsap.from(elementRef.current, {
        opacity: 0, // Start fully transparent
        y: 20, // Start 20 pixels down from its final position
        delay: delay, // Wait for the specified delay before starting
        duration: duration, // How long the animation should take
        ease: "power3.out", // An easing function to make the animation feel smooth
      });
    }
  }, [delay, duration]); // The effect will re-run only if delay or duration props change.

  // The hook returns the ref, so the component can attach it to a JSX element.
  return elementRef;
};

export default useFadeIn;
