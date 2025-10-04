import React, { memo } from 'react'

import { getItems } from '@/entities/doc/api/docApi'
import type { Part } from '@/entities/doc/model/types'
import Box from '@/shared/ui/Box'
import Spinner from '@/shared/ui/Spinner'

interface Props {}

const Example: React.FC<Props> = memo(() => {
  const [partList, setPartList] = React.useState<Part[]>([])

  React.useEffect(() => {
    getItems()
      .then((data) => {
        console.log(data)
        setPartList(data.data as Part[])
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <>
      <Box>
        {partList.length === 0 ? (
          <Spinner />
        ) : (
          <ul>
            {partList.map((part) => (
              <li key={part.id}>
                <span>{part.name}</span>
                <span>{part.count}</span>
              </li>
            ))}
          </ul>
        )}
      </Box>
    </>
  )
})
Example.displayName = 'Example'

export default Example
