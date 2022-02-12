import {useEffect, useReducer, useState} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const initialState = {
  productsList: [],
  apiStatus: apiStatusConstants.initial,
  activeOptionId: sortbyOptions[0].optionId,
  activeCategoryId: '',
  searchInput: '',
  activeRatingId: '',
}
const reducer = (state, action) => {
  switch (action.type) {
    case apiStatusConstants.inProgress:
      return {...state, apiStatus: apiStatusConstants.inProgress}
    case apiStatusConstants.success:
      return {
        ...state,
        apiStatus: apiStatusConstants.success,
        productsList: action.payload,
      }
    case apiStatusConstants.failure:
      console.log(action.payload)
      return {...state, apiStatus: apiStatusConstants.failure}
    case 'SORT':
      return {...state, activeOptionId: action.payload}
    case 'RATING':
      return {...state, activeRatingId: action.payload}
    case 'CATEGORY':
      return {...state, activeCategoryId: action.payload}
    case 'CLEAR':
      return {
        ...state,
        activeCategoryId: '',
        searchInput: '',
        activeRatingId: '',
      }
    case 'SEARCHTEXT':
      return {...state, searchInput: action.payload}
    default:
      return state
  }
}

function AllProductsSection() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [searchText, setsearchText] = useState('')
  const {
    activeOptionId,
    activeCategoryId,
    searchInput,
    activeRatingId,
    productsList,
  } = state
  useEffect(() => {
    const getProducts = async () => {
      dispatch({type: apiStatusConstants.inProgress})

      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        dispatch({type: apiStatusConstants.success, payload: updatedData})
      } else {
        dispatch({type: apiStatusConstants.failure})
      }
    }
    getProducts()
  }, [activeOptionId, activeCategoryId, searchInput, activeRatingId])

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  const changeSortby = OptionId => {
    dispatch({type: 'SORT', payload: OptionId})
  }

  const renderProductsListView = () => {
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  const renderAllProducts = () => {
    const {apiStatus} = state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductsListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const clearFilters = () => {
    dispatch({type: 'CLEAR'})
  }

  const changeRating = RatingId => {
    dispatch({type: 'RATING', payload: RatingId})
  }

  const changeCategory = CategoryId => {
    dispatch({type: 'CATEGORY', payload: CategoryId})
  }

  const enterSearchInput = () => {
    dispatch({type: 'SEARCHTEXT', payload: searchText})
  }

  const changeSearchInput = Input => {
    setsearchText(Input)
  }
  return (
    <div className="all-products-section">
      <FiltersGroup
        searchInput={searchText}
        categoryOptions={categoryOptions}
        ratingsList={ratingsList}
        changeSearchInput={changeSearchInput}
        enterSearchInput={enterSearchInput}
        activeCategoryId={activeCategoryId}
        activeRatingId={activeRatingId}
        changeCategory={changeCategory}
        changeRating={changeRating}
        clearFilters={clearFilters}
      />
      {renderAllProducts()}
    </div>
  )
}

export default AllProductsSection
