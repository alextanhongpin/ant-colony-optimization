import random

def objective_function(vector):
	return sum([x ** 2 for x in vector])

def random_vector(search_space):
	return [random.uniform(i[0], i[1]) for i in search_space]
	

def create_particle(search_space, vel_space):
	particle = {}
	particle['position'] = random_vector(search_space)
	particle['cost'] = objective_function(particle['position'])
	particle['best_position'] = particle['position'][:]
	particle['best_cost'] = particle['cost']
	particle['velocity'] = random_vector(vel_space)
	return particle

def get_global_best(population, current_best = None):
	sorted_population = sorted(population, key=lambda k: k['cost'])
	best = sorted_population[0]
	if current_best is None or best['cost'] <= current_best['cost']:
		current_best = {}
		current_best['position'] = best['position'][:]
		current_best['cost'] = best['cost']
	return current_best

def update_velocity(particle, gbest, max_v, c1, c2):
	for i, v in enumerate(particle['velocity']):
		v1 = c1 * random.random() * (particle['best_position'][i] - particle['position'][i])
		v2 = c2 * random.random() * (gbest['position'][i] - particle['position'][i])
		particle['velocity'][i] = v + v1 + v2
		if particle['velocity'][i] > max_v: 
			particle['velocity'][i] = max_v 
		if particle['velocity'][i] < -max_v:
			particle['velocity'][i] = -max_v
	

def update_position(part, bounds):
	for i, v in enumerate(part['position']):
		part['position'][i] = v + part['velocity'][i]
		if part['position'][i] > bounds[i][1]:
			part['position'][i] = bounds[i][1] - abs(part['position'][i] - bounds[i][1])
			part['velocity'][i] *= -1.0
		elif part['position'][i] < bounds[i][0]:
			part['position'][i] = bounds[i][0] - abs(part['position'][i] - bounds[i][0])
			part['velocity'][i] *= -1.0

def update_best_position(particle):
	if particle['cost'] > particle['best_cost']: return
	particle['b_cost'] = particle['cost']
	particle['b_position'] = particle['position'][:]

def search(max_gens, search_space, vel_space, population_size, max_vel, c1, c2):
	population = [create_particle(search_space, vel_space) for i in range(population_size)]
	gbest = get_global_best(population)
	for i in range(max_gens):
		for particle in population:
			update_velocity(particle, gbest, max_vel, c1, c2)
			update_position(particle, search_space)
			particle['cost'] = objective_function(particle['position'])
			update_best_position(particle)
		gbest = get_global_best(population, gbest)
	return gbest
		
def main():
	# Problem configuration	
	problem_size = 2
	search_space = [[-5, 5]] * problem_size

	# Algorithm configuration
	vel_space = [[-1, 1]] * problem_size
	max_gens = 100
	population_size = 50
	max_vel = 100.0
	c1, c2 = 2.0, 2.0
	
	best = search(max_gens, search_space, vel_space, population_size, max_vel, c1, c2)
	print('done', best)



main()
