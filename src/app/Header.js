import Link from "next/link";
import styles from './header.module.css';

export default function Header() {
  return (
    <div className={styles['header-container']}>
      <Link href="/weekly-status-update" className={styles['header-link']}>
        <h3><u>Weekly Status Update</u></h3>
      </Link>
      <Link href="/" className={styles['header-link']}>
        <h3><u>Upload Meeting</u></h3>
      </Link>
    </div>
  );
}
