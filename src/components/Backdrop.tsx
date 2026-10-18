import styles from "./Backdrop.module.css"

export function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.fields}>
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
      </div>
      <div className={styles.grain} />
    </div>
  )
}
