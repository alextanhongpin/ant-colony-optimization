class Ant {
  constructor (tourSize) {
    this.trailSize = tourSize
    this.trail = new Array(tourSize)
    // this.visited =
  }
  visitCity (currentIndex, city) {
    this.trail[currentIndex + 1] = city
    this.visited[city] = true
  }
  visited (i) {
    return this.visited[i]
  }
  trailLength (graph) {
    let length = graph[this.trail[this.trailSize - 1]][this.trail[0]]
    for (let i = 0; i < this.trailSize - 1; i += 1) {
      length += graph[this.trail[i]][this.trail[i + 1]]
    }
    return length
  }
  clear () {
    for (let i = 0; i < this.trailSize; i += 1) {
      this.visited[i] = false
    }
  }
}

module.exports = Ant
