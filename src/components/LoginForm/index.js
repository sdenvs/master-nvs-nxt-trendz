import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import {useReducer} from 'react'

import './index.css'

const loginactionTypes = {
  userChange: 'USER-ONCHANGE',
  passChange: 'PASS-ONCHANGE',
  loginSuccess: 'LOGIN-SUCEESS',
  loginFailed: 'LOGIN-FAILED',
}

const initialState = {
  username: 'rahul',
  password: 'rahul@2021',
  showSubmitError: false,
  errorMsg: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case loginactionTypes.userChange:
      return {...state, username: action.payload}
    case loginactionTypes.passChange:
      return {...state, password: action.payload}
    case loginactionTypes.loginSuccess:
      return {...state, showSubmitError: false}
    case loginactionTypes.loginFailed:
      return {...state, showSubmitError: true, errorMsg: action.payload}
    default:
      return state
  }
}

function LoginForm(props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  const onChangeUsername = event => {
    dispatch({type: loginactionTypes.userChange, payload: event.target.value})
  }

  const onChangePassword = event => {
    dispatch({type: loginactionTypes.passChange, payload: event.target.value})
  }

  const onSubmitSuccess = jwtTokenToSet => {
    const {history} = props
    dispatch({type: loginactionTypes.loginSuccess})

    Cookies.set('jwt_token', jwtTokenToSet, {
      expires: 30,
    })
    history.replace('/')
  }

  const onSubmitFailure = errorMsg => {
    dispatch({type: loginactionTypes.passChange, payload: errorMsg})
  }

  const submitForm = async event => {
    event.preventDefault()
    const {username, password} = state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const renderPasswordField = () => {
    const {password} = state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  const renderUsernameField = () => {
    const {username} = state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  const {showSubmitError, errorMsg} = state

  return (
    <div className="login-form-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
        className="login-website-logo-mobile-img"
        alt="website logo"
      />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="login-img"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  )
}

export default LoginForm
