import { IO_APP_ID } from '../../constants'
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo'

export const config = {
  id: IO_APP_ID,
  name: "Devices",
  description: "MIDI input & output",
  icon: SettingsInputSvideoIcon,
  openInDrawer: true,
}

// eslint-disable-next-line
export { default } from './settings'
export { default as BackgroundTask } from './backgroundTask'
