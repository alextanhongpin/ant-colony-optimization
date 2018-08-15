for ant in ants:
	current_city = ant.current_city
	transition_probabilities = []
	for city in unvisited:
		denominator = 0
		numerator = (pow(tau[current_city][city], alpha) * (eta[current_city][city], beta))
		for city in unvisited:
			denominator += (pow(tau[current_city][city], alpha) * (eta[current_city][city], beta))
		
		p_ij = numerator / float(denominator)
		transition_probabilities.append(p_ij)
	
	next_city = numpy.choice(unvisited, 1, transition_probabilities)

