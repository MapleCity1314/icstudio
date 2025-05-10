import React from 'react'
import styles from './404.module.css'
import Link from 'next/link'

const Page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.cow}>
        <div className={styles.head}>
          <div className={styles.face}></div>
        </div>
        <div className={`${styles.leg} ${styles.f} ${styles.l}`}></div>
        <div className={`${styles.leg} ${styles.f} ${styles.r}`}></div>
        <div className={`${styles.leg} ${styles.b} ${styles.l}`}></div>
        <div className={`${styles.leg} ${styles.b} ${styles.r}`}></div>
        <div className={styles.tail}></div>
      </div>

      <div className={styles.well}>
        <Link href="/" className={styles.homeBtn}>
          首页
        </Link>
      </div>
      <div className={styles.textBox}>
        <h1>404</h1>
        <p>这里不准停牛</p>
      </div>
    </div>
  )
}

export default Page
