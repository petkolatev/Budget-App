"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Preloader.module.css";
import { usePathname } from "next/navigation";

const Preloader: React.FC = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;
  return (
    <div className={styles.preloader}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Preloader;
