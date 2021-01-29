import { genUUID } from './util'

export function initUser(ctx) {
  const userId = localStorage.getItem('sman_user_id')
  if (!userId) {
    window.localStorage.setItem('sman_user_id', genUUID())
  }
}

export function getUserId() {
  return window.localStorage.getItem('sman_user_id')
}
