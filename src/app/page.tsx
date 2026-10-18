import type { Metadata } from "next"

import { Backdrop } from "@/components/Backdrop"
import { ClockWall } from "@/components/ClockWall"

import styles from "./page.module.css"

export const metadata: Metadata = { alternates: { canonical: "/" } }

export default function Home() {
  return (
    <div className={styles.screen}>
      <Backdrop />
      <ClockWall />
    </div>
  )
}
