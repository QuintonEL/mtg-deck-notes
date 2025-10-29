import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import DeckDetail from "../features/decks/DeckDetail";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/deck/:id", element: <DeckDetail /> },
]);
