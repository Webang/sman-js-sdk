/**
 * 获取性能信息
 */
const getPerformance = () => {
  const timing = window.performance.timing
  return {
    redirect_time: timing.redirectEnd - timing.redirectStart,
    request_time: timing.responseEnd - timing.requestStart,
    dom_time: timing.domComplete - timing.domLoading,
    load_time: timing.loadEventEnd - timing.navigationStart,
    timing: timing
  }
}

export function initPerformance(ctx) {
  window.addEventListener('load', () => {
    const t = getPerformance()
    console.log(t)
    ctx.sendPageView(t)
  })
}
