import React, { memo, Suspense } from 'react'

import Counter from '@/features/counter'
import DocList from '@/features/doc-list'
import logo from '@/shared/assets/logo.svg'
import Box from '@/shared/ui/Box'
import Spinner from '@/shared/ui/Spinner'
import styles from '@/widgets/Layout/Layout.module.css'

interface Props {}

const Index: React.FC<Props> = memo(() => {
  return (
    <>
      <Box>
        <h1 className={styles.h1}>I'm REACT_APP_TEXT from .env</h1>
        <img src={logo} alt="react-logo" className="react-logo" />
      </Box>
      <Box>
        <Counter />
      </Box>
      <Box>
        <Suspense fallback={<Spinner size="xl" />}>
          <DocList />
        </Suspense>
      </Box>
    </>
  )
})
Index.displayName = 'Index'

export default Index
