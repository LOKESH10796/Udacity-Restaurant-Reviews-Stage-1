import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Filter, MapPin, Truck, Utensils, Map } from 'lucide-react'

interface Restaurant {
  id: number
  name: string
  neighborhood: string
  cuisine_type: string
  address: string
  latlng: { lat: number; lng: number }
  photograph?: string
  operating_hours?: Record<string, string>
  reviews?: Array<{ name: string; rating: number; comments: string; date: string }>
}

const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'The Golden Spoon',
    neighborhood: 'Downtown',
    cuisine_type: 'American',
    address: '123 Main St, Downtown',
    latlng: { lat: 40.7128, lng: -74.0060 },
    photograph: 'restaurant-1.jpg',
    operating_hours: {
      'Monday': '11:00 AM - 10:00 PM',
      'Tuesday': '11:00 AM - 10:00 PM',
      'Wednesday': '11:00 AM - 10:00 PM',
      'Thursday': '11:00 AM - 11:00 PM',
      'Friday': '11:00 AM - 11:00 PM',
      'Saturday': '10:00 AM - 12:00 AM',
      'Sunday': '10:00 AM - 9:00 PM'
    },
    reviews: [
      { name: 'John D.', rating: 5, comments: 'Amazing food and great service!', date: '2024-01-15' },
      { name: 'Sarah M.', rating: 4, comments: 'Really enjoyed the atmosphere.', date: '2024-01-10' }
    ]
  },
  {
    id: 2,
    name: 'Bella Italia',
    neighborhood: 'Northside',
    cuisine_type: 'Italian',
    address: '456 Oak Ave, Northside',
    latlng: { lat: 40.7589, lng: -73.9851 },
    photograph: 'restaurant-2.jpg',
    operating_hours: {
      'Monday': 'Closed',
      'Tuesday': '5:00 PM - 10:00 PM',
      'Wednesday': '5:00 PM - 10:00 PM',
      'Thursday': '5:00 PM - 10:00 PM',
      'Friday': '5:00 PM - 11:00 PM',
      'Saturday': '4:00 PM - 11:00 PM',
      'Sunday': '4:00 PM - 9:00 PM'
    },
    reviews: [
      { name: 'Maria K.', rating: 5, comments: 'Best pasta in town!', date: '2024-01-20' }
    ]
  },
  {
    id: 3,
    name: 'Tokyo Sushi',
    neighborhood: 'Eastside',
    cuisine_type: 'Japanese',
    address: '789 Pine St, Eastside',
    latlng: { lat: 40.7505, lng: -73.9934 },
    photograph: 'restaurant-3.jpg',
    operating_hours: {
      'Monday': '11:30 AM - 9:30 PM',
      'Tuesday': '11:30 AM - 9:30 PM',
      'Wednesday': '11:30 AM - 9:30 PM',
      'Thursday': '11:30 AM - 10:00 PM',
      'Friday': '11:30 AM - 10:30 PM',
      'Saturday': '12:00 PM - 10:30 PM',
      'Sunday': 'Closed'
    },
    reviews: [
      { name: 'Ken T.', rating: 5, comments: 'Freshest sushi around!', date: '2024-01-18' }
    ]
  }
]

function RestaurantMap({ restaurants, selectedRestaurant }: { restaurants: Restaurant[]; selectedRestaurant: Restaurant | null }) {
  const center = selectedRestaurant?.latlng || { lat: 40.7128, lng: -74.0060 }

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.latlng.lat, restaurant.latlng.lng]}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-primary-800">{restaurant.name}</h3>
              <p className="text-sm text-primary-600">{restaurant.cuisine_type} • {restaurant.neighborhood}</p>
              <p className="text-sm text-primary-500 mt-1">{restaurant.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

function FilterBar({ 
  neighborhoods, 
  cuisines, 
  selectedNeighborhood, 
  selectedCuisine, 
  onNeighborhoodChange, 
  onCuisineChange 
}: { 
  neighborhoods: string[]
  cuisines: string[]
  selectedNeighborhood: string
  selectedCuisine: string
  onNeighborhoodChange: (value: string) => void
  onCuisineChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-primary-100">
      <div className="flex-1">
        <label htmlFor="neighborhoods-select" className="block text-sm font-medium text-primary-700 mb-1">
          <Filter className="inline w-4 h-4 mr-1" /> Neighborhood
        </label>
        <select
          id="neighborhoods-select"
          value={selectedNeighborhood}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
          className="filter-select"
          aria-label="Select neighborhood"
        >
          {neighborhoods.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="cuisines-select" className="block text-sm font-medium text-primary-700 mb-1">
          <Utensils className="inline w-4 h-4 mr-1" /> Cuisine
        </label>
        <select
          id="cuisines-select"
          value={selectedCuisine}
          onChange={(e) => onCuisineChange(e.target.value)}
          className="filter-select"
          aria-label="Select cuisine"
        >
          {cuisines.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  )
}

export default function App() {
  const [restaurants] = useState<Restaurant[]>(SAMPLE_RESTAURANTS)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All Neighborhoods')
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showMap, setShowMap] = useState(true)

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const neighborhoodMatch = selectedNeighborhood === 'All Neighborhoods' || restaurant.neighborhood === selectedNeighborhood
      const cuisineMatch = selectedCuisine === 'All Cuisines' || restaurant.cuisine_type === selectedCuisine
      return neighborhoodMatch && cuisineMatch
    })
  }, [restaurants, selectedNeighborhood, selectedCuisine])

  const allNeighborhoods = useMemo(() => 
    ['All Neighborhoods', ...new Set(restaurants.map(r => r.neighborhood))], 
    [restaurants]
  )
  
  const allCuisines = useMemo(() => 
    ['All Cuisines', ...new Set(restaurants.map(r => r.cuisine_type))], 
    [restaurants]
  )

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow-sm border-b border-primary-100 sticky top-0 z-50">
        <div className="container-main py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-800 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary-500" />
              Restaurant Reviews
            </h1>
            <button 
              onClick={() => setShowMap(!showMap)}
              className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label={showMap ? 'Hide map' : 'Show map'}
            >
              {showMap ? <Map className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="container-main py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {showMap && (
            <section className="lg:col-span-2" aria-label="Restaurant Map">
              <h2 className="section-title flex items-center gap-2">
                <Map className="w-6 h-6" />
                Restaurant Map
              </h2>
              <div className="h-[500px] bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
                <RestaurantMap 
                  restaurants={filteredRestaurants} 
                  selectedRestaurant={selectedRestaurant} 
                />
              </div>
            </section>
          )}

          <section className="lg:col-span-1" aria-label="Filters and Restaurant List">
            <FilterBar
              neighborhoods={allNeighborhoods}
              cuisines={allCuisines}
              selectedNeighborhood={selectedNeighborhood}
              selectedCuisine={selectedCuisine}
              onNeighborhoodChange={setSelectedNeighborhood}
              onCuisineChange={setSelectedCuisine}
            />

            <h2 className="section-title flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              Restaurants ({filteredRestaurants.length})
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
              {filteredRestaurants.length === 0 ? (
                <div className="p-8 text-center text-primary-500">
                  <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No restaurants found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <ul className="divide-y divide-primary-100" role="list">
                  {filteredRestaurants.map((restaurant) => (
                    <li key={restaurant.id}>
                      <button
                        onClick={() => setSelectedRestaurant(restaurant)}
                        className="w-full p-4 text-left hover:bg-primary-50 transition-colors"
                        aria-label={`View ${restaurant.name} on map`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-primary-100">
                            {restaurant.photograph ? (
                              <img
                                src={`/img/${restaurant.photograph}`}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary-400">
                                <Utensils className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-primary-900 truncate">{restaurant.name}</h3>
                            <p className="text-sm text-primary-500 mt-1 truncate">{restaurant.cuisine_type} • {restaurant.neighborhood}</p>
                            <p className="text-xs text-primary-400 mt-1 truncate">{restaurant.address}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRestaurant(restaurant) }}
                            className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors ml-2"
                            aria-label={`View ${restaurant.name} details`}
                          >
                            <MapPin className="w-5 h-5" />
                          </button>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-primary-900 text-primary-100 py-8 mt-12">
        <div className="container-main text-center">
          <p>&copy; 2024 <strong>Restaurant Reviews</strong> All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}