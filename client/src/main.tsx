import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import Leaflet CSS for maps
import "leaflet/dist/leaflet.css";
// Add Font Awesome for icons
import "@fortawesome/fontawesome-free/css/all.min.css";

// Set page title
document.title = "WaveGuard - Beach Safety App";

createRoot(document.getElementById("root")!).render(<App />);
