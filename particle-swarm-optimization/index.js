
function search (maxGenerations, searchSpace, velocitySpace, populationSize, maxVelocity, c1, c2) {
  let population = Array(populationSize).fill(0).map(_ => createParticle(searchSpace, velocitySpace))
  let globalBest = getGlobalBest(population)
  for (let _ of Array(maxGenerations)) { // eslint-disable-line no-unused-vars
    for (let particle of population) {
      updateVelocity(particle, globalBest, maxVelocity, c1, c2)
      updatePosition(particle, searchSpace)
      particle.cost = objectiveFunction(particle.position)
      updateBestPosition(particle)
    }
    globalBest = getGlobalBest(population, globalBest)
  }
  return globalBest
}

function randomVector (searchSpace) {
  return searchSpace.map(([min, max]) =>
    Math.random() * max * 2 + min
  )
}

function createParticle (searchSpace, velocitySpace) {
  let position = randomVector(searchSpace)
  let cost = objectiveFunction(position)
  let particle = {
    position,
    cost,
    bestPosition: [...position],
    bestCost: cost,
    velocity: randomVector(velocitySpace)
  }
  return particle
}

function getGlobalBest (population, currentBest) {
  let sortedPopulation = population.sort((a, b) => a.cost - b.cost)
  let best = sortedPopulation[0]

  if (!currentBest || best.cost <= currentBest.cost) {
    currentBest = {
      position: [...best.position],
      cost: best.cost
    }
  }
  return currentBest
}

function updateVelocity (particle, globalBest, maxVelocity, c1, c2) {
  particle.velocity.forEach((velocity, i) => {
    let v1 = c1 * Math.random() * (particle.bestPosition[i] - particle.position[i])
    let v2 = c2 * Math.random() * (globalBest.position[i] * particle.position[i])
    particle.velocity[i] = velocity + v1 + v2
    if (particle.velocity[i] > maxVelocity) {
      particle.velocity[i] = maxVelocity
    }
    if (particle.velocity[i] < -maxVelocity) {
      particle.velocity[i] = -maxVelocity
    }
  })
}

function updatePosition (part, bounds) {
  part.position.forEach((position, i) => {
    part.position[i] = position + part.velocity[i]

    // Out of maximum bound, reverse positio
    if (part.position[i] > bounds[i][1]) {
      part.position[i] = bounds[i][1] - Math.abs(part.position[i] - bounds[i][1])
      part.velocity[i] *= -1.0
    }

    // Out of minimum bound, reverse position
    if (part.position[i] < bounds[i][0]) {
      part.position[i] = bounds[i][0] - Math.abs(part.position[i] - bounds[i][0])
      part.velocity[i] *= -1.0
    }
  })
}

function updateBestPosition (particle) {
  if (particle.cost > particle.bestCost) return

  particle.bestCost = particle.cost
  particle.bestPosition = [...particle.position]
}

function objectiveFunction (vector) {
  return vector.reduce((total, v) => total + Math.pow(v, 2), 0)
}

function main () {
  // Problem configuration
  let problemSize = 2
  let searchSpace = Array(problemSize).fill(0).map(_ => [-5, 5]) // eslint-disable-line no-unused-vars

  // Algorithm configuration
  let velocitySpace = Array(problemSize).fill(0).map(_ => [-1, 1]) // eslint-disbale-line no-unused-vars
  let maxGenerations = 100
  let populationSize = 50
  let maxVelocity = 100.0
  let [c1, c2] = [2.0, 2.0]
  console.log('searchSpace', searchSpace)
  let best = search(maxGenerations, searchSpace, velocitySpace, populationSize, maxVelocity, c1, c2)
  console.log(best)
}

main()
