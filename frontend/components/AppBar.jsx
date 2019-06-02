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
  Menu
} from '@material-ui/core'
import {
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  ExitToAppRounded as LogoutIcon,
  Tonality
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

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
    display: 'block'
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
function PrimarySearchAppBar ({ dark, changeDark }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

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

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          color='inherit'
          onClick={e => {
            changeDark({ variables: { dark: !dark.dark } })
          }}
        >
          <Tonality />
        </IconButton>
        <p>Mode</p>
      </MenuItem>
      <MenuItem>
        <IconButton color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem
        onClick={e => {
          localStorage.removeItem('jwtToken')
          window.location.reload()
        }}
      >
        <IconButton color='inherit'>
          <LogoutIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  )
  return (
    <div className={classes.grow}>
      <AppBar position='static' className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant='h6' noWrap>
            eSkill
          </Typography>

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
            <IconButton color='inherit'>
              <Badge badgeContent={17} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge='end'
              color='inherit'
              onClick={e => {
                localStorage.removeItem('jwtToken')
                window.location.reload()
              }}
            >
              <LogoutIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  )
}

export default compose(
  graphql(GET_DARK, { name: 'dark' }),
  graphql(CHANGE_DARK, { name: 'changeDark' })
)(PrimarySearchAppBar)
