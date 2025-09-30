import React, { memo, Suspense } from 'react'

import Box from '@/shared/ui/Box'
import Spinner from '@/shared/ui/Spinner'

import Counter from '@/features/counter'
import DocList from '@/features/doc-list'
import styles from './index.module.css'

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
