// Register service worker
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registered:", registration);
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed:", error);
        });
    });
  }
}
