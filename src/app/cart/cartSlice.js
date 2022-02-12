import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  cartList: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeAllCartItems: () => ({cartList: []}),

    addCartItem: (state, action) => {
      const productObject = state.cartList.find(
        eachCartItem => eachCartItem.id === action.payload.id,
      )
      if (productObject !== undefined) {
        const updatedCartList = state.cartList.map(eachCartItem => {
          if (productObject.id === eachCartItem.id) {
            const updatedQuantity =
              eachCartItem.quantity + action.payload.quantity

            return {...eachCartItem, quantity: updatedQuantity}
          }
          return eachCartItem
        })
        console.log(updatedCartList)
        return {cartList: updatedCartList}
      }
      return {cartList: [...state.cartList, action.payload]}
    },
    incrementCartItemQuantity: (state, action) => {
      const updatedCartList = state.cartList.map(eachCartItem => {
        if (action.payload === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity + 1
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      })
      return {cartList: updatedCartList}
    },
    decrementCartItemQuantity: (state, action) => {
      const updatedCartList = state.cartList.map(eachCartItem => {
        if (action.payload === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity - 1
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      })
      return {cartList: updatedCartList}
    },
    removeCartItem: (state, action) => {
      const updatedCartList = state.cartList.filter(
        eachCartItem => eachCartItem.id !== action.payload,
      )
      return {cartList: updatedCartList}
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  removeAllCartItems,
  addCartItem,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeCartItem,
} = cartSlice.actions

export default cartSlice.reducer
