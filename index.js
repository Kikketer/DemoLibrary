import { captureMessage } from '@sentry/minimal'

export const createMessage = (message) => {
  console.log('Capturing a message')
  captureMessage(message || 'This is a test message from the library')
  return 'The message was captured'
}
