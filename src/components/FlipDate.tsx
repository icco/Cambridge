import { useState } from "react"

import styles from "./FlipDate.module.css"

export function FlipDate({ iso }: { iso: string }) {
  const [initial] = useState(() => iso.split("-"))
  const groups = iso.split("-")

  return (
    <div className={styles.date} role="img" aria-label={`London date ${iso}`}>
      {groups.map((value, i) => (
        <span
          // Remounting a changed tile replays its flip animation.
          key={`${i}-${value}`}
          className={`${styles.tile} ${value !== initial[i] ? styles.flip : ""}`}
        >
          {value}
        </span>
      ))}
    </div>
  )
}
