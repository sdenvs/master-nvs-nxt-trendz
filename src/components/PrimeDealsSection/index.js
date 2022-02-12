import {useEffect, useReducer} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const initialState = {
  primeDeals: [],
  apiStatus: apiStatusConstants.initial,
}
const reducer = (state, action) => {
  switch (action.type) {
    case apiStatusConstants.inProgress:
      return {...state, apiStatus: apiStatusConstants.inProgress}
    case apiStatusConstants.success:
      return {
        ...state,
        apiStatus: apiStatusConstants.success,
        primeDeals: action.payload,
      }
    case apiStatusConstants.failure:
      return {...state, apiStatus: apiStatusConstants.failure}
    default:
      return state
  }
}

function PrimeDealsSection() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {primeDeals, apiStatus} = state

  useEffect(() => {
    const getPrimeDeals = async () => {
      dispatch({type: apiStatusConstants.inProgress})

      const jwtToken = Cookies.get('jwt_token')

      const apiUrl = 'https://apis.ccbp.in/prime-deals'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok === true) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.prime_deals.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        dispatch({type: apiStatusConstants.success, payload: updatedData})
      }
      if (response.status === 401) {
        dispatch({type: apiStatusConstants.failure})
      }
    }
    getPrimeDeals()
  }, [])

  const renderPrimeDealsListView = () => (
    <div>
      <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
      <ul className="products-list">
        {primeDeals.map(product => (
          <ProductCard productData={product} key={product.id} />
        ))}
      </ul>
    </div>
  )
  const renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="register prime"
      className="register-prime-img"
    />
  )

  const renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  switch (apiStatus) {
    case apiStatusConstants.success:
      return renderPrimeDealsListView()
    case apiStatusConstants.failure:
      return renderPrimeDealsFailureView()
    case apiStatusConstants.inProgress:
      return renderLoadingView()
    default:
      return null
  }
}

export default PrimeDealsSection
