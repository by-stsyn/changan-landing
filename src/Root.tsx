import { useState, useEffect } from "react";
import App from "./App";
import CarDetailRoute from "./pages/CarDetailRoute";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import { persistUtmParams } from "./components/calltouch";

export default function Root() {
  const [path, setPath] = useState(window.location.pathname);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    persistUtmParams();
    // Scroll to top immediately when route changes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path]);

  useEffect(() => {
    function onPopState() {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    function onHashChange() {
      if (window.location.hash === "#privacy-policy") {
        setIsPrivacyModalOpen(true);
      }
    }

    function onOpenPrivacyModal() {
      setIsPrivacyModalOpen(true);
    }

    // Intercept clicks on any privacy policy links so they open reliably in-app
    // without being blocked by iframe sandbox restrictions
    function onGlobalClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (target) {
        const href = target.getAttribute("href") || "";
        if (href.includes("privacy-policy")) {
          e.preventDefault();
          setIsPrivacyModalOpen(true);
        }
      }
    }

    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("open-privacy-modal", onOpenPrivacyModal);
    document.addEventListener("click", onGlobalClick);

    if (window.location.hash === "#privacy-policy") {
      setIsPrivacyModalOpen(true);
    }

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("open-privacy-modal", onOpenPrivacyModal);
      document.removeEventListener("click", onGlobalClick);
    };
  }, []);

  const carMatch = path.match(/^\/car\/([^/]+)\/?$/);

  return (
    <>
      {carMatch ? <CarDetailRoute vin={carMatch[1]} /> : <App />}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => {
          setIsPrivacyModalOpen(false);
          if (window.location.hash === "#privacy-policy") {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }}
      />
    </>
  );
}
