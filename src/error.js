export function initErrorEvent(ctx) {
  function resolveStack(e) {
    const frames = []
    const list = e.error.stack.split('\n')

    list.forEach((element, index) => {
      if (index !== 0) {
        const reg = /^(    at)( .*)?( .*)$/
        let [, , arg2, arg3] = reg.exec(element)
        let fun = arg2 ? arg2.replace(/\s/g, '') : '?'

        const [protol, filename, lineno, colno] = arg3
          .replace(/\s/g, '')
          .replace('(', '')
          .replace(')', '')
          .split(':')

        frames.push({
          filename: protol + ':' + filename, // 文件名
          colno: +colno, // 列数
          function: fun, // 调用函数
          lineno: +lineno, // 行数
        })
      }
    })
    return frames
  }

  // 资源加载错误
  window.addEventListener(
    'error',
    function (e) {
      const target = e.target
      if (target !== window) {
        ctx.sendErrorEevent({
          type: 'resource',
          value: (target.src || target.href) + ' load error',
          message: (target.src || target.href) + ' load error',
        })
      }
    },
    true
  )

  // Promise.reject
  window.addEventListener('unhandledrejection', function (e) {
    // console.log(e)
    if (!e.reason.isAxiosError) {
      ctx.sendErrorEevent({
        type: 'unhandledrejection',
        value: (e.reason && e.reason.msg) || e.reason || '',
        message: (e.reason && e.reason.msg) || e.reason || '',
      })
    }
  })

  // 常规JS错误
  window.addEventListener('error', function (e) {
    const message = e.message
    const [type, value] = message.replace('Uncaught ', '').split(': ')
    ctx.sendErrorEevent({
      type: type,
      value: value,
      message: message,
      stacktrace: {
        frames: resolveStack(e),
      },
    })
  })
}
