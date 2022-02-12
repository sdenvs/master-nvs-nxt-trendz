import {useEffect, useReducer} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {useDispatch} from 'react-redux'
import {addCartItem} from '../../app/cart/cartSlice'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const initialState = {
  productData: {},
  similarProductsData: [],
  apiStatus: apiStatusConstants.initial,
  quantity: 1,
}
const reducer = (state, action) => {
  switch (action.type) {
    case apiStatusConstants.inProgress:
      return {...state, apiStatus: apiStatusConstants.inProgress}
    case apiStatusConstants.success:
      return {
        ...state,
        apiStatus: apiStatusConstants.success,
        productData: action.payload.productData,
        similarProductsData: action.payload.similarProductsData,
      }
    case apiStatusConstants.failure:
      return {...state, apiStatus: apiStatusConstants.failure}
    case 'DECREASEQTY':
      return {
        ...state,
        quantity: state.quantity > 1 ? state.quantity - 1 : state.quantity,
      }
    case 'INCREASEQTY':
      return {
        ...state,
        quantity: state.quantity + 1,
      }
    default:
      return state
  }
}

function ProductItemDetails(props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const dispatchreducer = useDispatch()
  const {productData, quantity, similarProductsData} = state

  const getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })
  useEffect(() => {
    const getProductData = async () => {
      const {match} = props
      const {params} = match
      const {id} = params

      dispatch({type: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = `https://apis.ccbp.in/products/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = getFormattedData(fetchedData)
        const updatedSimilarProductsData = fetchedData.similar_products.map(
          eachSimilarProduct => getFormattedData(eachSimilarProduct),
        )
        dispatch({
          type: apiStatusConstants.success,
          payload: {
            productData: updatedData,
            similarProductsData: updatedSimilarProductsData,
          },
        })
      }
      if (response.status === 404) {
        dispatch({type: apiStatusConstants.failure})
      }
    }
    getProductData()
  }, [])

  const renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  const onDecrementQuantity = () => {
    dispatch({type: 'DECREASEQTY'})
  }

  const onIncrementQuantity = () => {
    dispatch({type: 'INCREASEQTY'})
  }

  const renderProductDetailsView = () => {
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    const onClickAddToCart = () => {
      dispatchreducer(addCartItem({...productData, quantity}))
    }
    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onDecrementQuantity}
                testid="minus"
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={onIncrementQuantity}
                testid="plus"
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button
              type="button"
              className="button add-to-cart-btn"
              onClick={onClickAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  const renderProductDetails = () => {
    const {apiStatus} = state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductDetailsView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <div className="product-item-details-container">
        {renderProductDetails()}
      </div>
    </>
  )
}

export default ProductItemDetails
