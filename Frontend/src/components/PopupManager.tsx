"use client";

import { useEffect, useState } from "react";
import WelcomePopup from "./WelcomePopup";

export default function PopupManager({ children }: { children: React.ReactNode }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya ha visto el popup en esta sesión
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    
    // Mostrar popup después de un breve delay para mejor UX
    const timer = setTimeout(() => {
      if (!hasSeenPopup) {
        setShowPopup(true);
        // Marcar como visto en sessionStorage
        sessionStorage.setItem("hasSeenWelcomePopup", "true");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {children}
      <WelcomePopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onStart={() => setShowPopup(true)}
      />
    </>
  );
}