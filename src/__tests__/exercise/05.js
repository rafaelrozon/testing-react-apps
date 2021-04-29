// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {handlers} from 'test/server-handlers'

import {build, fake} from '@jackfranklin/test-data-bot'
// 1. import rest and setupServer
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Login from '../../components/login-submission'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started
// rest.post(
//   'https://auth-provider.example.com/api/login',
//   async (req, res, ctx) => {},
// )
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/
// 2. create the server and add handlers
const server = setupServer(...handlers)

// 🐨 before all the tests, start the server with `server.listen()`
// prepare and clean up
beforeAll(() => {
  server.listen()
})
// 🐨 after all the tests, stop the server with `server.close()`
afterAll(() => {
  server.close()
})

afterEach(() =>  server.resetHandlers())

test(`logging in displays the user's username`, async () => {
  render(<Login />)

  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})

test('error message is displayed when username and password is not provided', async () => {
  const {username} = buildLoginForm()

  render(<Login />)

  userEvent.type(screen.getByLabelText(/username/i), username)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole(/alert/i).textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test('works correctly if server returns 500', async () => {
  const errorMsg = "booooo";
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: errorMsg}))
      },
    ),
  )

  render(<Login />)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole(/alert/i)).toHaveTextContent(errorMsg)
})
