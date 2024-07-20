import { Ordinalsbot } from 'ordinalsbot'

let ordinalsbotInstance = null

export const getOrdinalsbotInstance = () => {
  if (!ordinalsbotInstance) {
    ordinalsbotInstance = new Ordinalsbot('', import.meta.env.VITE_NETWORK)
  }
  return ordinalsbotInstance
}
