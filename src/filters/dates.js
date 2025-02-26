import { format } from "date-fns"

export const longDate = (dateObj) => {
  return format(dateObj, "do MMMM yyyy")
}

export const shortDate = (dateObj) => {
  return format(dateObj, "d MMM yyyy")
}

export const longYear = (dateObj) => {
  return format(dateObj, "yyyy")
}
