export const formatAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}
