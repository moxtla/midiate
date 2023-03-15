import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

import { addApp, switchDrawerApp } from '../redux/actions'
import { 
  getForegroundAppId, 
  getDrawerAppId, 
  getIsAnyMidiInputActive,
  getApp,
  getThemeId,
} from '../redux/selectors'

import { wrapContext } from '../api/context'
import StatusBar from './statusBar'
import LoadingScreen from './loadingScreen'
import themes from './themes'
import { IO_APP_ID } from '../constants'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    contain: 'strict',
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    '@global > .MuiContainer-root': {
      padding: theme.spacing(4),
    }
  },
}))

class Client extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apps: {},
      statusBar: {}, 
      drawer: {}, 
      backgroundTasks: {},
    }
  }

  componentDidMount() {
    let apps = {}, statusBar = {}, drawer = {}, backgroundTasks = {}

    // load apps from config file 
    const appsFromConfig = require('../config/apps').default

    for (const app of appsFromConfig) {
      const appConfig = app.config
      if (!appConfig) {
        throw new Error('all apps must provide config')
      }

      const appId = appConfig.id
      if (appId === undefined) {
        console.error('no ID', appConfig)
        throw new Error('all apps must define ID')
      }

      this.props.addApp(appId, appConfig)
      // save apps on state
      if (app.default) 
        apps[appId] = wrapContext(app.default, appConfig)
      if (app.StatusBar)
        statusBar[appId] = wrapContext(app.StatusBar, appConfig)
      if (app.BackgroundTask)
        backgroundTasks[appId] = wrapContext(app.BackgroundTask, appConfig)
      if (app.Drawer) 
        drawer[appId] = wrapContext(app.Drawer, appConfig)
    }

    this.setState({apps, statusBar, drawer, backgroundTasks})
  }

  render() {
    const {apps, statusBar, drawer, backgroundTasks} = this.state
    const {foregroundAppId, getApp} = this.props

    let app
    if (apps[foregroundAppId]) {
      app = React.createElement(apps[foregroundAppId], {config: getApp(foregroundAppId)})
    }
    const statusBarItems = Object.entries(statusBar).map(([id, s]) => 
      React.createElement(s, {config: getApp(id)}))

    const drawerItems = Object.entries(drawer).map(([id, s]) => 
      React.createElement(s, {config: getApp(id)}))

    const tasks = Object.entries(backgroundTasks).map(([id, s]) => 
      React.createElement(s, {config: getApp(id), key: id}))

    // render with all the other UI elements
		return (
      <Content 
        {...this.props} 
        statusBarItems={statusBarItems} 
        drawerItems={drawerItems} 
        apps={apps}
      >
        {tasks}
        {app}
      </Content>
    )
  }
}

// separate to functional component to easily include themes
function Content(props) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={props.theme}> 
        {/* css */}
        <CssBaseline />
        {/* content */}
        <LoadingScreen /> 
        <AppLayout {...props}>
          {props.children}
        </AppLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

function AppLayout(props) {
	const classes = useStyles()
  const [hideWarning, setHideWarning] = useState(false)
  const {isAnyMidiInputActive, drawerAppId,
    switchDrawerApp, children} = props

  const switchToDefaultApp = useCallback(() =>
    switchDrawerApp(IO_APP_ID)
  , [switchDrawerApp])
  const dismissWarning = useCallback(() =>
    setHideWarning(true)
  , [])

	return (
    <div className={clsx(
      classes.root, 
      isAnyMidiInputActive ? "hasMidiInputs" : "noMidiInputs",
    )}>
      <StatusBar {...props} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.container}>
          {children}
        </div>
      </main>
        <Snackbar
          open={!isAnyMidiInputActive 
            && drawerAppId !== IO_APP_ID
            && !hideWarning}
          message="No active MIDI inputs"
          action={
            <React.Fragment>
              <Button color="inherit" 
                onClick={switchToDefaultApp}>
                Choose
              </Button>
              <Button color="inherit" 
                onClick={dismissWarning}>
                Dismiss 
              </Button>
            </React.Fragment>
        }
      />
    </div>
  )
}

export default connect(
  (state, ownProps) => ({
    foregroundAppId: getForegroundAppId(state),
    drawerAppId: getDrawerAppId(state),
    getApp: id => getApp(state, id),
    isAnyMidiInputActive: getIsAnyMidiInputActive(state),
    theme: themes[getThemeId(state)].theme,
  }),
  { 
    addApp, 
    switchDrawerApp,
  }
)(Client)
