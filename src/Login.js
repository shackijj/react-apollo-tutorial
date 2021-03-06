import React, { Component } from 'react'
import { AUTH_TOKEN } from './constants'
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo'

const SIGNUP_MUTATION = gql`
mutation SignupMutation($email: String!, $password: String!, $name: String!) {
  signup(email: $email, password: $password, name: $name) {
    user {
      id
    }
    token
  }
}
`

const LOGIN_MUTATION = gql`
mutation LoginMutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
    }
    token
  }
}
`


class Login extends Component {

  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: ''
  }

  render() {

    return (
      <div>
        <h4 className='mv3'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className='flex flex-column'>
          {!this.state.login &&
          <input
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
            type='text'
            placeholder='Your name'
          />}
          <input
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            type='text'
            placeholder='Your email address'
          />
          <input
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            type='password'
            placeholder='Choose a safe password'
          />
        </div>
        <div className='flex mt3'>
          <div
            className='pointer mr2 button'
            onClick={() => this._confirm()}
          >
            {this.state.login ? 'login' : 'create account' }
          </div>
          <div
            className='pointer button'
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

  _confirm = async () => {
   const { name, email, password } = this.state;
   if (this.state.login) {
    const result = await this.props.loginMutation({
      variables: {
        email,
        password
      }
    })
    const { user, token } = result.data.login
    this._saveUserData(user.id, token);
   } else {
     const result = await this.props.signupMutation({
       variables: {
         name, 
         email,
         password
       }
     })
     const { user, token } = result.data.signup
     this._saveUserData(user.id, token);
   }
  }

  _saveUserData = (userId, token) => {
    localStorage.setItem(AUTH_TOKEN, token)
    const rc = localStorage.getItem(AUTH_TOKEN)
    console.log('RESULT', rc)
  }

}

export default compose(
    graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
    graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
  )(Login)