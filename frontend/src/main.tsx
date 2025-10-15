
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import InvoiceGenerator from './components/InvoiceGenerator.tsx';

  createRoot(document.getElementById("root")!).render(<App />);
  