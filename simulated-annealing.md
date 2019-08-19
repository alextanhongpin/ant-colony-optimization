## Simulated annealing

Solving the travelling salesman problem with simulated annealing.

```js
class City {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  distanceTo(city) {
    const {
      x,
      y
    } = city
    const deltaX = Math.abs(this.x - x)
    const deltaY = Math.abs(this.y - y)
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    return distance
  }
  toString() {
    return `${this.x}, ${this.y}`
  }
}

class TourManager {
  constructor(cities = []) {
    this.cities = cities
  }
  copy() {
    // Clone the city to avoid unwanted side-effects.
    return new TourManager([...this.cities])
  }
  addCity(city) {
    this.cities.push(city)
  }
  getCity(index) {
    return this.cities[index]
  }
  size() {
    return this.cities.length
  }
  swap(i, j) {
    const tmp = this.cities[i]
    this.cities[i] = this.cities[j]
    this.cities[j] = tmp
  }
}

class Tour {
  constructor(tourManager) {
    this.tourManager = tourManager.copy()
    this.distance = 0
  }
  getDistance() {
    if (!this.distance) {
      let tourDistance = 0
      for (let index in this.tourManager.cities) {
        // The key is a string - convert it back to int.
        index = parseInt(index, 10)
        const fromCity = this.tourManager.getCity(index)
        const toCity = index + 1 < this.tourManager.size() ?
          this.tourManager.getCity(index + 1) :
          this.tourManager.getCity(0)
        tourDistance += fromCity.distanceTo(toCity)
      }
      this.distance = tourDistance
    }
    return this.distance
  }
  tourSize() {
    return this.tourManager.size()
  }
  swapCity(i, j) {
    this.tourManager.swap(i, j)
  }
  toString() {
    return this.tourManager.cities.map(city => city.toString()).join('|')
  }
}

class SimulatedAnnealing {
  static acceptanceProbability(energy, newEnergy, temperature) {
    // If the new solution is better, accept it. This will always be greater than the randomized 0-1 value.
    if (newEnergy < energy) return 1

    // If the new solution is worse, calculate the acceptance probability.
    return Math.exp((energy - newEnergy) / temperature)
  }
}

function main() {
  const points = [
    [60, 200],
    [180, 200],
    [80, 180],
    [140, 180],
    [20, 160],
    [100, 160],
    [200, 160],
    [140, 140],
    [40, 120],
    [100, 120],
    [180, 100],
    [60, 80],
    [120, 80],
    [180, 60],
    [20, 40],
    [100, 40],
    [200, 40],
    [20, 20],
    [60, 20],
    [160, 20]
  ]
  const cities = points.map(([x, y]) => new City(x, y))
  const tourManager = new TourManager(cities)

  let temperature = 10_000
  let coolingRate = 0.003

  // Initialize initial solution.
  let currentSolution = new Tour(tourManager)
  console.log('Initial solution:', currentSolution.getDistance())

  // Set as s0, the current best.
  let best = new Tour(currentSolution.tourManager)

  // Loop until the system has cooled.
  while (temperature > 1) {
    // Create new neighbour tour.
    const newSolution = new Tour(currentSolution.tourManager)
    const pos1 = Math.floor(newSolution.tourSize() * Math.random())
    const pos2 = Math.floor(newSolution.tourSize() * Math.random())
    newSolution.swapCity(pos1, pos2)

    // Get energy of solution.
    const currentEnergy = currentSolution.getDistance()
    const neighbourEnergy = newSolution.getDistance()

    // Decide if we should accept the neighbour.
    if (SimulatedAnnealing.acceptanceProbability(currentEnergy, neighbourEnergy, temperature) > Math.random()) {
      currentSolution = new Tour(newSolution.tourManager)
    }

    // Keep track of the best solution found.
    if (currentSolution.getDistance() < best.getDistance()) {
      best = new Tour(currentSolution.tourManager)
    }
    // Cool system.
    temperature *= (1 - coolingRate)
  }
  console.log('best solution is', best.getDistance())
  console.log(best.toString())
}

main()
```

## References

- http://www.cleveralgorithms.com/nature-inspired/physical/simulated_annealing.html
- http://www.theprojectspot.com/tutorial-post/simulated-annealing-algorithm-for-beginners/6
- https://en.wikipedia.org/wiki/Simulated_annealing
