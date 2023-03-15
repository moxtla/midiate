import React, { useCallback } from 'react'
import { createSelector } from 'reselect'
import { useSelector, useDispatch } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import AppDefaultIcon from '@mui/icons-material/MusicVideo'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { 
  getDrawerAppId,
  getApps,
  getDrawerOpen,
} from '../redux/selectors'
import { 
  switchDrawerApp, 
  switchForegroundApp,
  toggleDrawer, 
} from '../redux/actions'

const useStyles = makeStyles({
  drawer: {
    width: '25em',
    maxWidth: '90vw',
  },
  btnContainer: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
    pointerEvents: 'none',
  },
})

const getDrawerAppConfig = createSelector(
  [getApps, getDrawerAppId],
  (apps, id) => apps[id]
)

function SideDrawer({ apps, items }) {
  const classes = useStyles()

  const drawerOpen = useSelector(getDrawerOpen)
  const drawerAppId = useSelector(getDrawerAppId)
  const drawerAppConfig = useSelector(getDrawerAppConfig)
  const appConfigs = Object.values(useSelector(getApps))
  const dispatch = useDispatch()

  const toggle = useCallback(open => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    dispatch(toggleDrawer(open))
  }, [dispatch])

  return (
    <React.Fragment>
      <IconButton color="inherit" onClick={toggle(true)} size="large">
        <MenuIcon />
      </IconButton> 
      <Drawer anchor='right' open={drawerOpen} onClose={toggle(false)}>
        <div
          className={classes.drawer}
          role="presentation"
          onKeyDown={toggle(false)}
        >
        {drawerAppId != null 
        && (
          <div className={classes.btnContainer}>
            <IconButton className={classes.backButton} size="large">
              <ChevronLeftIcon />
            </IconButton>
          </div>
        )}
        {drawerAppId != null 
          ? (
            <React.Fragment>
              <AppItem action={() => dispatch(switchDrawerApp(null))} {...drawerAppConfig} />
              {React.createElement(apps[drawerAppId], {config: drawerAppConfig})}
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <List>
                {appConfigs.filter(app => app.openInDrawer === true).map(app => 
                  <AppItem key={app.id} action={() => dispatch(switchDrawerApp(app.id))} {...app} />)}
              </List>
              <Divider />
              <List>
                {items.map(item => 
                  <ListItem key={item.props.config.id} button onClick={() => {
                    dispatch(switchForegroundApp(item.props.config.id))
                    dispatch(toggleDrawer(false))
                  }}>
                    {item}
                  </ListItem>
                )}
              </List>
            </React.Fragment>
        )}
        </div>
      </Drawer>
    </React.Fragment>
  );
}


function AppItem({ id, icon, name, description, action }) {
  return (
    <ListItem button onClick={action}>
      <ListItemIcon>
        {icon ? React.createElement(icon) : <AppDefaultIcon />}
      </ListItemIcon>
      <ListItemText primary={name} secondary={description} />
    </ListItem>
  )
}

export default SideDrawer
