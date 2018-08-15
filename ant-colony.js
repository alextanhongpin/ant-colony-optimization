
function euclidean (p1, p2) {
  // if (!(p1 && p2)) { console.log('euclidean', p1, p2) }
  // const sq1 = Math.pow(p1[0] - p2[0], 2)
  // const sq2 = Math.pow(p1[1] - p2[1], 2)
  const sumOfSquare = [
    p1[0] - p2[0],
    p1[1] - p2[1]
  ]
  .map(i => Math.pow(i, 2))
  .reduce((l, r) => l + r)

  return Math.round(Math.sqrt(sumOfSquare))
}

function cost (permutation, cities) {
  return permutation.reduce((distance, c1, i) => {
    const c2 = i === permutation.length - 1 ? permutation[0] : permutation[i + 1]
    distance += euclidean(cities[c1], cities[c2])
    return distance
  }, 0)
}

function randomPermutation (cities) {
  const citySize = cities.length
  const perm = Array(citySize).fill(0).map((_, i) => i)
  perm.forEach(i => {
    const r = Math.floor(Math.random() * perm.length - 1) + 1
    // Swap items
    const temp = perm[r]
    perm[r] = perm[i]
    perm[i] = temp
  })
  return perm
}

function initializePheromeMatrix (numCities, initPher) {
  return Array(numCities).fill(0).map((_) => Array(numCities).fill(initPher))
}

function calculateChoices (cities, lastCity, exclude, pherome, cHeur, cHist) {
  const choices = []
  for (let i = 0; i < cities.length; i += 1) {
    const coord = cities[i]
    if (exclude.includes(i)) {
      continue
    }
    const prob = {
      city: i,
      history: Math.pow(pherome[lastCity][i], cHist),
      distance: euclidean(cities[lastCity], coord)
    }
    prob.heuristic = Math.pow(1.0 / prob.distance, cHeur)
    prob.prob = prob.history * prob.heuristic
    choices.push(prob)
  }
  return choices
}

function probSelect (choices) {
  const sum = choices.reduce((acc, element) => acc + element.prob, 0.0)
  if (sum === 0.0) {
    return choices[Math.floor(Math.random() * choices.length)].city
  }
  let v = Math.random()
  for (let i = 0; i < choices.length; i += 1) {
    const choice = choices[i]
    v -= choice.prob / sum
    if (v <= 0) {
      return choice.city
    }
    if (i === choices.length - 1) {
      return choice.city
    }
  }
}
// Verify that it is returning the largest
function greedySelect (choices) {
  return choices.sort((a, b) => b.prob - a.prob)[0].city
}

function stepwiseConst (cities, phero, cHeur, cGreed) {
  const perm = []
  perm.push(Math.floor(Math.random() * cities.length))
  do {
    const choices = calculateChoices(cities, perm[perm.length - 1], perm, phero, cHeur, 1.0)
    const greedy = Math.random() <= cGreed
    const nextCity = greedy ? greedySelect(choices) : probSelect(choices)
    perm.push(nextCity)
  } while (perm.length !== cities.length)
  return perm
}

function globalUpdatePheromone (pheromone, cand, decay) {
  cand.vector.forEach((x, i) => {
    const y = i === cand.vector.length - 1 ? cand.vector[0] : cand.vector[i + 1]
    const value = ((1.0 - decay) * pheromone[x][y]) + (decay * (1.0 / cand.cost))
    pheromone[x][y] = value
    pheromone[y][x] = value
  })
}

function localUpdatePheromone (pheromone, cand, cLocalPhero, initPhero) {
  cand.vector.forEach((x, i) => {
    const y = (i === cand.vector.length - 1) ? cand.vector[0] : cand.vector[i + 1]
    const value = ((1.0 - cLocalPhero) * pheromone[x][y]) + (cLocalPhero * initPhero)
    pheromone[x][y] = value
    pheromone[y][x] = value
  })
}

function search (cities, maxIt, numAnts, decay, cHeur, cLocalPhero, cGreed, cb) {
  let best = { vector: randomPermutation(cities) }
  best.cost = cost(best.vector, cities)
  const initPheromone = 1.0 / (cities.length * best.cost)
  const pheromone = initializePheromeMatrix(cities.length, initPheromone)
  Array(maxIt).fill(0).forEach((_, iter) => {
    Array(numAnts).fill(0).forEach(() => {
      const cand = {}
      cand.vector = stepwiseConst(cities, pheromone, cHeur, cGreed)
      cand.cost = cost(cand.vector, cities)
      best = cand.cost < best.cost ? cand : best
      localUpdatePheromone(pheromone, cand, cLocalPhero, initPheromone)
    })
    globalUpdatePheromone(pheromone, best, decay)
    if (cb) {
      cb(best)
    }
    console.log(`iteration ${iter + 1}, best = ${best.cost}`)
  })
  return best
}

function main () {
  const berlin52 = [[565, 575], [25, 185], [345, 750], [945, 685], [845, 655],
   [880, 660], [25, 230], [525, 1000], [580, 1175], [650, 1130], [1605, 620],
   [1220, 580], [1465, 200], [1530, 5], [845, 680], [725, 370], [145, 665],
   [415, 635], [510, 875], [560, 365], [300, 465], [520, 585], [480, 415],
   [835, 625], [975, 580], [1215, 245], [1320, 315], [1250, 400], [660, 180],
   [410, 250], [420, 555], [575, 665], [1150, 1160], [700, 580], [685, 595],
   [685, 610], [770, 610], [795, 645], [720, 635], [760, 650], [475, 960],
   [95, 260], [875, 920], [700, 500], [555, 815], [830, 485], [1170, 65],
   [830, 610], [605, 625], [595, 360], [1340, 725], [1740, 245]]

  const maxIt = 100
  const numAnts = 10
  const decay = 0.1
  const cHeur = 2.5
  const cLocalPhero = 0.1
  const cGreed = 0.9

  // console.log(randomPermutation(berlin52.slice(0, 5)))
  const best = search(berlin52, maxIt, numAnts, decay, cHeur, cLocalPhero, cGreed)
  console.log(`Done. Best Solution: c=${best.cost}, v=${best.vector}`)
}

// main()
