// src/hooks/useClickOutside.js

import { useEffect } from "react";

/**
 * A custom hook that detects clicks outside of a specified element.
 * @param {React.RefObject} ref - The ref of the element to monitor.
 * @param {Function} handler - The function to call when a click outside is detected.
 */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // If the click is inside the ref's element, do nothing
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Otherwise, call the handler function (which will close the dropdown)
      handler(event);
    };

    // Add the event listeners
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove the listeners when the component unmounts
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Re-run the effect if the ref or handler changes
}

export default useClickOutside;
