import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

expect.extend({
  toBeInTheDocument(received) {
    const pass = Boolean(
      received &&
        (received.ownerDocument?.documentElement?.contains(received) ||
          document.contains(received)),
    )
    return {
      pass,
      message: () =>
        pass
          ? 'expected element not to be in document'
          : 'expected element to be in document',
    }
  },
  toHaveTextContent(received, expected) {
    const text = received?.textContent ?? ''
    const pass =
      expected instanceof RegExp ? expected.test(text) : text.includes(String(expected))
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have text content "${expected}", got "${text}"`
          : `expected element to have text content "${expected}", got "${text}"`,
    }
  },
  toBeChecked(received) {
    const pass = Boolean(received?.checked)
    return {
      pass,
      message: () =>
        pass
          ? 'expected element not to be checked'
          : 'expected element to be checked',
    }
  },
})
