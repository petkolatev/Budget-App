import styles from "../styles/Toast.module.css";
import Image from "next/image";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {type === "success" && (
        <Image
          src="/images/success.png"
          alt="Successful"
          width={64}
          height={64}
        />
      )}
      {type === "error" && (
        <Image src="/images/error.png" alt="Error" width={64} height={64} />
      )}
      <span>{message}</span>
      <button onClick={onClose}>X</button>
    </div>
  );
}
