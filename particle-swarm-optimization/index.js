function search(maxGenerations, searchSpace, velocitySpace, populationsSize, maxVelocity, c1, c2) {
		
}
function main() {
	// Problem configuration
	let problemSize = 2
	let searchSpace = Array(problemSize).fill([-5, 5])
	
	// Algorithm configuration
	let velocitySpace = Array(problemSize).fill([-1, 1])
	let maxGenerations = 100
	let populationSize = 50
	let maxVelocity = 100.0
	let [c1, c2] = [2.0, 2.0]
	
	let best = search(maxGenerations, searchSpace, velocitySpace, populationSize, maxVelocity, c1, c2) 
	console.log(best)
}

main()
