const createOutputError = () => new Error('Output channel failed')

export const createJsonLineWriter = (stream) => async (value) => {
  let line
  try {
    line = `${JSON.stringify(value)}\n`
  } catch {
    throw createOutputError()
  }

  await new Promise((resolve, reject) => {
    let callbackCompleted = false
    let deferredCleanup
    let drainCompleted = true
    let settled = false
    let writeReturned = false

    const removeListener = (event, listener) => {
      try {
        stream.off(event, listener)
      } catch {
        // Listener cleanup cannot make a completed output attempt fail.
      }
    }

    const cleanup = () => {
      if (deferredCleanup) {
        clearImmediate(deferredCleanup)
        deferredCleanup = undefined
      }
      removeListener('error', onError)
      removeListener('drain', onDrain)
    }
    const succeed = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const fail = ({ waitForWriteError = false } = {}) => {
      if (settled) return
      settled = true
      removeListener('drain', onDrain)
      if (waitForWriteError) {
        deferredCleanup = setImmediate(cleanup)
      } else {
        cleanup()
      }
      reject(createOutputError())
    }
    const completeWhenFlushed = () => {
      if (
        writeReturned &&
        callbackCompleted &&
        drainCompleted
      ) {
        succeed()
      }
    }
    const onError = () => {
      if (settled) {
        cleanup()
        return
      }
      fail()
    }
    const onDrain = () => {
      drainCompleted = true
      completeWhenFlushed()
    }
    const onWrite = (error) => {
      if (error) {
        // Node Writable reports the callback error again as an error event.
        // Keep the handler for that event, with a bounded fallback for doubles
        // that invoke the callback without implementing the stream lifecycle.
        fail({ waitForWriteError: true })
        return
      }
      callbackCompleted = true
      completeWhenFlushed()
    }

    try {
      stream.once('error', onError)
      const accepted = stream.write(line, onWrite)
      writeReturned = true
      if (settled) return
      if (accepted === false) {
        drainCompleted = false
        stream.once('drain', onDrain)
      }
      completeWhenFlushed()
    } catch {
      fail()
    }
  })
}

export const emitJsonLineSafely = async ({ writeOutput, value }) => {
  try {
    await writeOutput(value)
    return true
  } catch {
    return false
  }
}
