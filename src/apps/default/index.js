import React from 'react'
import { connect } from 'react-redux'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AppDefaultIcon from '@mui/icons-material/MusicVideo'
import GitHubIcon from '@mui/icons-material/GitHub'
import makeStyles from '@mui/styles/makeStyles';

import { DEFAULT_APP_ID } from '../../constants'
import { 
  switchForegroundApp,
} from '../../redux/actions'
import { 
  getApps,
} from '../../redux/selectors'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    width: '15vw',
    minWidth: '150px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    margin: theme.spacing(1),
    transition: 'background ease-in .2s',
    '& > svg': {
      width: 'auto',
      height: 'auto',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.background.paper,
      '& > svg': {
        fill: theme.palette.background.paper,
      }
    },
  },
  link: {
    textDecoration: "none",
  },
}))

function AppButton({switchForegroundApp, config}) {
  const classes = useStyles()

  if (config.showInMenu === false || config.openInDrawer === true)
    return null

  return (
    <Paper className={classes.paper}
      onClick={() => switchForegroundApp(config.id)}>
      {config.icon ? React.createElement(config.icon) : <AppDefaultIcon />}
      <Typography variant="button">{config.name}</Typography>
    </Paper>
  )
}


function DefaultApp({apps, switchForegroundApp}) {
  const classes = useStyles()

  return (
    <Container maxWidth={null} className={classes.container}>
      {Object.values(apps).map(app => (
        <AppButton config={app} key={app.id}
          switchForegroundApp={switchForegroundApp} />
      ))}
      <a className={classes.link} href='https://github.com/thebne/midiate'>
        <Paper className={classes.paper}>
          <GitHubIcon />
          <Typography variant="button">Fork on GitHub</Typography>
        </Paper>
      </a>
    </Container>
  )
}

export const config = {
  id: DEFAULT_APP_ID,
  showInMenu: false,
}

export default connect(
  state => ({
    apps: getApps(state),
  }),
  { switchForegroundApp }
)(DefaultApp)
