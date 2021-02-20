import { ToastOptions } from "react-hot-toast/dist/core/types";
import { getColor } from "./constants/color";
import { memeShadowNF } from "./constants/shadow";

export const toastStyle: ToastOptions = {
  style: {
    border: `3px solid ${getColor("text")}`,
    padding: "16px",
    color: getColor("text"),
    borderRadius: 0,
    boxShadow: memeShadowNF,
    opacity: 1,
    fontWeight: 600,
  },
  iconTheme: {
    primary: getColor("text"),
    secondary: "#FFFAEE",
  },
  duration: 10 * 1000,
};
