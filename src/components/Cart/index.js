import {useDispatch, useSelector} from 'react-redux'
import {removeAllCartItems} from '../../app/cart/cartSlice'
import Header from '../Header'
import CartItem from '../CartItem'
import EmptyCartView from '../EmptyCartView'
import CartSummary from '../CartSummary'

import './index.css'

const Cart = () => {
  const cartList = useSelector(state => state.cart.cartList)
  const dispatch = useDispatch()

  return (
    <>
      <Header />
      <div className="cart-container">
        {cartList.length === 0 ? (
          <EmptyCartView />
        ) : (
          <div className="cart-content-container">
            <h1 className="cart-heading">My Cart</h1>
            <button
              type="button"
              className="remove-all-btn"
              onClick={() => dispatch(removeAllCartItems())}
            >
              Remove All
            </button>
            <ul className="cart-list">
              {cartList.map(eachCartItem => (
                <CartItem
                  key={eachCartItem.id}
                  cartItemDetails={eachCartItem}
                />
              ))}
            </ul>
            <CartSummary />
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
