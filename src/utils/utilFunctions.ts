export {throttle, debounce} from "lodash"
export {nameof} from "ts-simple-nameof"

// sleep for n miliseconds
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// insert text at a specific index in a string
export function insert(string:string, index:number,value:string) {
  return string.slice(0, index) + value + string.slice(index)
}

// remove element(s) from array
export function remove(array: any[], pElements: any | any[]) {
  const elements = Array.isArray(pElements) ? pElements : [pElements]
  elements.forEach(x => {
    const index = array.indexOf(x)
    if (index !== -1) array.splice(index, 1)
  })
}

// add element(s) to array if unique
export function addUnique(array: any[], pElements: any | any[]) {
  const elements = Array.isArray(pElements) ? pElements : [pElements]
  elements.forEach(x => {
    if (!array.includes(x)) array.push(x)
  })
}

// toggle element(s) in array
export function toggle(array: any[], pElements: any | any[]) {
  const elements = Array.isArray(pElements) ? pElements : [pElements]
  elements.forEach(x => {
    if (array.includes(x)) {
      array.splice(array.indexOf(x), 1)
    } else {
      array.push(x)
    }
  })
}

// get unique values of array
export function unique(array: any[]) {
  return Array.from(new Set(array))
}
