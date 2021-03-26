const Productos = []

export const setProductos = (prod) => {
  Productos.pop()
  if (Productos.length === 0) {
    Productos.push(prod)
  }
}
export const getProductos = () => {
  return Productos[0]
}

export const Reset = () => {
  Productos.pop()
}
