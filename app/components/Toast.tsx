import React, { useEffect, useState } from "react";

interface Props {
  message: string;
  type: "SUCCESS" | "FAIL";
}

const Toast = ({ message, type }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toastStyle = `toast ${
    type === "SUCCESS" ? "toast-success" : "toast-danger"
  }`;

  return (
    <div
      className={`fixed bottom-0 p-5 right-0 transition-opacity duration-700 w-full max-w-sm ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className={toastStyle}>{message}</div>
    </div>
  );
};

export default Toast;
