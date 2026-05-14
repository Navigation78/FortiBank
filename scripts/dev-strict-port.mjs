import { spawn } from 'node:child_process'
import { createServer } from 'node:net'

const STRICT_PORT = 3000
const forwardedArgs = process.argv.slice(2)

function getRequestedPort(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '-p' || arg === '--port') {
      return args[index + 1] ? Number(args[index + 1]) : null
    }

    if (arg.startsWith('-p=')) {
      return Number(arg.slice(3))
    }

    if (arg.startsWith('--port=')) {
      return Number(arg.slice('--port='.length))
    }
  }

  return null
}

function assertPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = createServer()

    server.once('error', error => {
      reject(error)
    })

    server.once('listening', () => {
      server.close(() => resolve())
    })

    server.listen(port, '0.0.0.0')
  })
}

const requestedPort = getRequestedPort(forwardedArgs)

if (requestedPort && requestedPort !== STRICT_PORT) {
  console.error(`FortiBank dev server is locked to port ${STRICT_PORT}. Refusing requested port ${requestedPort}.`)
  process.exit(1)
}

try {
  await assertPortAvailable(STRICT_PORT)
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${STRICT_PORT} is already in use. Stop the existing server before starting another one.`)
    process.exit(1)
  }

  throw error
}

const nextArgs = [
  '--max-http-header-size=32768',
  './node_modules/next/dist/bin/next',
  'dev',
  '-p',
  String(STRICT_PORT),
]

const child = spawn(process.execPath, nextArgs, {
  stdio: 'inherit',
  shell: false,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
