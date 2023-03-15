import React from 'react'
import Badge from '@mui/material/Badge'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import { green, yellow } from '@mui/material/colors'
import { useInstrumentType, useLoading, useTranspose } from './settings'

export default function DrawerItem() {
  const [loading] = useLoading()
  const [type] = useInstrumentType()
  const [transpose] = useTranspose()
  
  if (!type)
    return null

  const color = loading ? yellow[400] : green[400]
  const status = loading ? `Loading ${type}` : `Playing ${type}`

  const transposeString = transpose > 0 ? `+${transpose}` : transpose.toString()

  return (
    <React.Fragment>
      <ListItemIcon>
        <Badge badgeContent={transposeString} color="primary" invisible={!transpose}>
          <PlayCircleFilledIcon
            style={{ color }} />
        </Badge>
      </ListItemIcon>
      <ListItemText primary={status} secondary="Web Player" />
    </React.Fragment>
  )
}
