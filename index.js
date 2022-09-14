import { captureMessage } from '@sentry/minimal'

const createMessage = () => {
  console.log('Capturing a message')
  captureMessage('This is a test message from the library')
  return 'The message was captured'
}

export { captureMessage }
