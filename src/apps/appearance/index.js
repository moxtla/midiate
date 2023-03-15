import React from 'react'
import { connect } from 'react-redux'
import Radio from '@mui/material/Radio'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import BrushIcon from '@mui/icons-material/Brush'
import themes from '../../ui/themes'
import { 
  setThemeId, 
} from '../../redux/actions'
import { 
  getThemeId,
} from '../../redux/selectors'


export default connect(
  state => ({
    themeId: getThemeId(state),
  }),
  { setThemeId }
)(({themeId, setThemeId}) => {
  return (
    <List subheader={<ListSubheader>Theme</ListSubheader>}>
      {themes.map(({name, description}, id) => (
        <ListItem button onClick={() => setThemeId(id)} key={id}>
          <ListItemIcon>
            <Radio
              edge="start"
              checked={id === themeId}
              />
          </ListItemIcon>
          <ListItemText primary={name} secondary={description} />
        </ListItem>
      ))}
    </List>
  )
})

export const config = {
  id: 'APPEARANCE',
  name: 'Appearance',
  description: "Color themes and animations",
  icon: BrushIcon,
  openInDrawer: true,
}

