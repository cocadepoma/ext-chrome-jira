import { Box } from "@mui/material"
import { Navbar, Sidebar } from "../ui";

import styles from './Layout.module.css';

interface Props {
  title?: string;
  children?: React.ReactNode
}

export const Layout: React.FC<Props> = ({ title = 'OpenJira', children }: Props) => {
  return (
    <div className={styles.layout__container}>

      <Navbar />
      <Sidebar />

      <div className={styles['layout__content--container']}>
        {children}
      </div>
    </div>
  )
}
