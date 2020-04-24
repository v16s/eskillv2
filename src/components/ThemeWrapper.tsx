import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

const GET_DARK = gql`
  {
    dark @client
  }
`

export const ThemeWrapper = ({ children }) => {
  const { data } = useQuery(GET_DARK)

  const theme = createMuiTheme({
    palette: {
      type: data.dark ? 'dark' : 'light',
      primary: {
        main: '#3281ff'
      }
    }
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
