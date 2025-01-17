import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Zoom from '@mui/material/Zoom'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppDefaultIcon from '@mui/icons-material/MusicVideo'
import makeStyles from '@mui/styles/makeStyles';

import { PROGRAM_NAME, DEFAULT_APP_ID } from '../constants'
import { ReactComponent as Logo } from '../logo.svg'
import { 
  getForegroundAppId,
  getApp,
  makeGetStatusBarVisiblity
} from '../redux/selectors'
import { 
  switchForegroundApp, 
} from '../redux/actions'
import Drawer from './drawer'


const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    itemAlign: 'middle',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  titleText: {
    cursor: 'pointer',
  },
	titleSecondaryText: {
		paddingLeft: theme.spacing(3),
    '& svg': {
      verticalAlign: 'middle',
      marginRight: theme.spacing(1),
    },
	},

  logo: {
    verticalAlign: 'middle',
    minWidth: 0,
    width: '50px',
    height: '50px',
    position: 'relative',
    marginRight: '1vw',
    '& svg': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '50px',
      height: '50px',
      cursor: 'pointer',
    }
  },

  statusBarItem: {
    fontFamily: "'Baloo Tamma 2', cursive",
    width: '5vw',
    minWidth: '3em',
  },
}))


function StatusBar({foregroundAppConfig, foregroundAppId, 
  statusBarItems, drawerItems, apps, switchForegroundApp}) {
	const classes = useStyles()

  return (
				<AppBar position="absolute" 
            className={clsx(classes.appBar, 'app-bar')}>
					<Toolbar className={classes.toolbar}>
            <AppTitle
              foregroundAppId={foregroundAppId}
              foregroundAppConfig={foregroundAppConfig}
              switchForegroundApp={switchForegroundApp}
            />
            <Box display={{xs: 'none', sm: 'initial'}}>
              {statusBarItems.map(item =>
                <StatusBarIcon key={item.props.config.id}>
                  {item}
                </StatusBarIcon> 
               )}
            </Box>
            <Drawer apps={apps} items={drawerItems} /> 
					</Toolbar>
				</AppBar>
  )
}

const StatusBarIcon = connect((state, props) => ({
    visibility: makeGetStatusBarVisiblity(props.children.props.config.id)(state),
}), {
  switchForegroundApp
})(function ({visibility, children, switchForegroundApp}) {
  const classes = useStyles()

  const onClick = useCallback(() => switchForegroundApp(
    children.props.config.statusBarAction || children.props.config.id)
  , [switchForegroundApp,
      children.props.config.statusBarAction, children.props.config.id])

  if (!visibility)
    return null

  return (
    <IconButton
      color="inherit"
      onClick={onClick}
      className={classes.statusBarItem}
      size="large">
      {children}
    </IconButton>
  );
})

const AppTitle = React.memo(
  function AppTitle({foregroundAppId, foregroundAppConfig, switchForegroundApp}) {
	const classes = useStyles()
  const switchToDefaultApp = useCallback(() => 
    switchForegroundApp(DEFAULT_APP_ID)
  , [switchForegroundApp])

  return (
    <div className={classes.title}>
      <Button 
        onClick={switchToDefaultApp}
        className={classes.logo}>
        <Zoom in={foregroundAppId === DEFAULT_APP_ID}>
          <Logo />
        </Zoom>
        <Zoom in={foregroundAppId !== DEFAULT_APP_ID}>
          <ArrowBackIcon />
        </Zoom>
      </Button>
      <Typography component="h1" variant="h5" color="inherit" noWrap
        onClick={switchToDefaultApp} 
        className={classes.titleText}>
          {foregroundAppId !== DEFAULT_APP_ID
            ? <Box display={{xs: 'none', md: 'initial'}}>{PROGRAM_NAME}</Box> 
            : PROGRAM_NAME
          }
      </Typography>
      {foregroundAppConfig.name && (
        <Typography variant="subtitle1" color="inherit" noWrap className={classes.titleSecondaryText}>
          {foregroundAppConfig.icon ? React.createElement(foregroundAppConfig.icon) : <AppDefaultIcon />}
          {foregroundAppConfig.name}
        </Typography>
      )}
    </div>
  )
})

export default connect((state) => ({
    foregroundAppId: getForegroundAppId(state),
    foregroundAppConfig: getApp(state, getForegroundAppId(state)),
}), {
  switchForegroundApp
})(StatusBar)
