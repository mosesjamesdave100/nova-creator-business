import { useEffect } from "react";

// Closes a dropdown/menu when the pointer lands outside `ref`, shared by the
// TopBar's date selector, notifications and profile menu.
export function useClickOutside(ref, onOutside, active) {
  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, onOutside, active]);
}
