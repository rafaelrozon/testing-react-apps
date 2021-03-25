// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import ReactDOM from 'react-dom'
import Counter from '../../components/counter'

beforeEach(() => {
  document.body.innerHTML = "";
})

test('counter increments and decrements when the buttons are clicked', () => {
  const div = document.createElement("div");

  div.setAttribute("id", "root")
  
  document.body.append(div)
  
  ReactDOM.render(<Counter />, document.getElementById("root"))

  const buttons = div.querySelectorAll('button');
  const decrementBtn = buttons[0]
  const incrementBtn = buttons[1];
  const msg = div.querySelectorAll('div')[1];
  
  expect(msg.textContent).toBe("Current count: 0");
  
  incrementBtn.click();
  
  expect(msg.textContent).toBe("Current count: 1");
  
  decrementBtn.click()
  
  expect(msg.textContent).toBe('Current count: 0')
  
  // 🦉 If you don't cleanup, then it could impact other tests and/or cause a memory leak
})

/* eslint no-unused-vars:0 */
