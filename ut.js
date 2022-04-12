//  一个冻结对象，第一层不可以修改
const emptyObject = Object.freeze({})

// 判断是否已经定义
function isDef(v) {
  return v !== undefined && v !== null
}

// 判断是否没有定义
function isUndef(v) {
  returnv === undefined || v === null
}

function isTrue(v) { return v === true }
function isFalse(v) { return v === false }

/**
 * Js中假值有六个
 * false
 * null
 * ''
 * 0
 * undefined
 * NaN
 * 为了准确判断这些值， 封装了 isDef isTrue isFalse 来准确判断
 */

// 检查是否是一个原始值
// 判断是否是 字符串、数字、symbol、布尔值
function isPrimitive(value) {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    // $flow-disable-line
    || typeof value === 'symbol'
    || typeof value === 'boolean'
  )
}

// 判断对象， 包括[] ,function
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

// 查找原始类型
const _toString = Object.prototype.toString

export function toRawType(value) {
  return _toString.call(value).slice(8, -1)
}

// 检查类型是对象,
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

//  正则类型
export function isRegExp(v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}
