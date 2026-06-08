import "./styles.css";
import { mountHub } from "../apps/hub";

window.addEventListener("load", () => {
  const root = document.getElementById("app");

  if (!root) {
    throw new Error("Missing #app container.");
  }

  mountHub(root);
});
