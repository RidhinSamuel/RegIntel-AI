import type { JSX } from "react";
import "./App.css";
import Home from "./pages/Home";

/**
 * Root Application Component.
 * Renders the top-level page components and layouts.
 *
 * @returns {JSX.Element} The rendered React component tree.
 */
function App(): JSX.Element {
  return <Home />;
}

export default App;