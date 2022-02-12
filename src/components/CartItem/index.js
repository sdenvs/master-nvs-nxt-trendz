import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import {useDispatch} from 'react-redux'
import {
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  removeCartItem,
} from '../../app/cart/cartSlice'

import './index.css'

const CartItem = props => {
  const dispatch = useDispatch()

  const {cartItemDetails} = props
  const {id, title, brand, quantity, price, imageUrl} = cartItemDetails
  const onClickDecrement = () => dispatch(decrementCartItemQuantity(id))

  const onClickIncrement = () => dispatch(incrementCartItemQuantity(id))

  const onRemoveCartItem = () => dispatch(removeCartItem(id))
  const totalPrice = price * quantity

  return (
    <li className="cart-item">
      <img className="cart-product-image" src={imageUrl} alt={title} />
      <div className="cart-item-details-container">
        <div className="cart-product-title-brand-container">
          <p className="cart-product-title">{title}</p>
          <p className="cart-product-brand">by {brand}</p>
        </div>
        <div className="cart-quantity-container">
          <button
            type="button"
            className="quantity-controller-button"
            testid="minus"
            onClick={onClickDecrement}
          >
            <BsDashSquare color="#52606D" size={12} />
          </button>
          <p className="cart-quantity">{quantity}</p>
          <button
            type="button"
            className="quantity-controller-button"
            testid="plus"
            onClick={onClickIncrement}
          >
            <BsPlusSquare color="#52606D" size={12} />
          </button>
        </div>
        <div className="total-price-remove-container">
          <p className="cart-total-price">Rs {totalPrice}/-</p>
          <button
            className="remove-button"
            type="button"
            onClick={onRemoveCartItem}
          >
            Remove
          </button>
        </div>
      </div>
      <button
        className="delete-button"
        type="button"
        onClick={onRemoveCartItem}
        testid="remove"
      >
        <AiFillCloseCircle color="#616E7C" size={20} />
      </button>
    </li>
  )
}

export default CartItem
