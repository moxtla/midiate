import React from 'react'
import { connect } from 'react-redux'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Switch from '@mui/material/Switch'
import UsbIcon from '@mui/icons-material/Usb'
import { 
  toggleMidiInput, 
} from '../../../redux/actions'
import { useMidiInputs } from '../../../api/midi'

const MidiInputs = (({toggleMidiInput}) => {
  const midiInputs = useMidiInputs()
  return (
    <List subheader={<ListSubheader>MIDI Input</ListSubheader>}>
      {midiInputs.length === 0 
        && <ListItem><i>no input devices found</i></ListItem>}
      {midiInputs.map(input => (
        <ListItem key={input.id} button
          onClick={e => toggleMidiInput(input.id, !input.active)}
        >
          <ListItemIcon>
            <UsbIcon />
          </ListItemIcon>
          <ListItemText primary={input.name} />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={e => toggleMidiInput(input.id, e.target.checked)}
              checked={input.active}
        />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
})

export default connect(
  null,
  { toggleMidiInput }
)(MidiInputs)
