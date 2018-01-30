
class AntColonyOptimization {
  constructor () {
    this.c = 1.0
    this.alpha = 1
    this.beta = 5
    this.evaporation = 0.5
    this.Q = 500
    this.antFactor = 0.8
    this.randomFactor = 0.01

    this.maxIterations = 1000

    this.numberOfCities
    this.numberOfAnts
    this.graph = []
    this.trails = []
    this.ants = []
    this.random = Math.random()
    this.probabilities = []
    this.currentIndex
    this.bestTourOrder
    this.bestTourLength
  }

  AntColonyOptimization (noOfOffices) {
    this.graph = this.generateRandomMatrix(noOfOffices)
    this.numberOfCities = this.graph.length
    this.numberOfAnts = this.numberOfCities * this.antFactor
  }
}

function main () {
  let c = 1.0
  let alpha = 1
  let beta = 5
  let evaporation = 0.5
  let Q = 500
  let antFactor = 0.8
  let randomFactor = 0.01
}

function visitCity (currentIndex, city) {
  trail[currentIndex + 1] = city
}
