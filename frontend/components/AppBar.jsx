import React from 'react'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Button,
  SwipeableDrawer,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
  Divider
} from '@material-ui/core'
import {
  Notifications as NotificationsIcon,
  ExitToAppRounded as LogoutIcon,
  Tonality,
  Menu as MenuIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
const GET_DARK = gql`
  {
    dark @client
  }
`
const CHANGE_DARK = gql`
  mutation ChangeDark($dark: Boolean!) {
    changeDark(dark: $dark) @client
  }
`

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: 'block',
    textTransform: 'none'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: theme.palette.primary.main
  }
}))
function PrimarySearchAppBar ({ dark, changeDark, history }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [menuv, setMenu] = React.useState(false)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = menuv

  function handleProfileMenuOpen (event) {
    setAnchorEl(event.currentTarget)
  }

  function handleMobileMenuClose () {
    setMobileMoreAnchorEl(null)
  }

  function handleMenuClose () {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  function handleMobileMenuOpen (event) {
    setMobileMoreAnchorEl(event.currentTarget)
  }
  const toggleDrawer = open => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setMenu(open)
  }
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const sideList = side => (
    <div
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{ width: 250 }}
    >
      <List>
        <ListItem
          button
          onClick={e => {
            changeDark({ variables: { dark: !dark.dark } })
          }}
        >
          <ListItemIcon>
            <Tonality />
          </ListItemIcon>
          <ListItemText primary={'Mode'} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <Badge badgeContent={11} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary={'Notifications'} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={e => {
            localStorage.removeItem('jwtToken')
            window.location.reload()
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={'Logout'} />
        </ListItem>
      </List>
    </div>
  )
  const renderMobileMenu = (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={menuv}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {sideList('left')}
    </SwipeableDrawer>
  )
  return (
    <div className={classes.grow}>
      <AppBar position='static' className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.sectionMobile}
            edge='start'
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Button
            color='primary'
            onClick={e => {
              e.preventDefault()
              history.push('/')
            }}
          >
            <Typography className={classes.title} variant='h6' noWrap>
              eSkill
            </Typography>
          </Button>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              color='primary'
              onClick={e => {
                changeDark({ variables: { dark: !dark.dark } })
              }}
            >
              <Tonality />
            </IconButton>

            <IconButton
              edge='end'
              onClick={e => {
                localStorage.removeItem('jwtToken')
                window.location.reload()
              }}
            >
              <LogoutIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  )
}

const AppBarBase = compose(
  graphql(GET_DARK, { name: 'dark' }),
  graphql(CHANGE_DARK, { name: 'changeDark' })
)(withRouter(PrimarySearchAppBar))
export { AppBarBase as AppBar }
