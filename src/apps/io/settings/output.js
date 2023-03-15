import React, { useCallback } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Switch from '@mui/material/Switch'
import UsbIcon from '@mui/icons-material/Usb'
import { useSetting } from '../../../api/settings'
import { useMidiOutputs } from '../../../api/midi'

export default React.memo(function MidiOutput() {
  const midiOutputs = useMidiOutputs()
  const [activeOutputs, setActiveOutputs] = useActiveOutputs()

  const toggleMidiOutput = useCallback((output) => {
    setActiveOutputs(activeOutputs => {
      const newOutputs = [...activeOutputs]
      if (newOutputs.indexOf(output.id) !== -1) {
        newOutputs.splice(output.id, 1)
      } else {
        newOutputs.push(output.id)
      }
      return newOutputs
    })
  }, [setActiveOutputs])

	return (
    <React.Fragment>
      <List>
        <ListSubheader>MIDI Output</ListSubheader>
        {midiOutputs.length === 0 
          && <ListItem><i>no output devices found</i></ListItem>}
        {midiOutputs.map(output => (
          <ListItem key={output.id} button
              onClick={() => toggleMidiOutput(output)}
            >
            <ListItemIcon>
              <UsbIcon />
            </ListItemIcon>
            <ListItemText primary={output.name} />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                onChange={() => toggleMidiOutput(output)}
                checked={activeOutputs.indexOf(output.id) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
	)
})

export const useActiveOutputs = () => 
  useSetting('activeOutputs', [])
