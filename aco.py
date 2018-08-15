def objective_function(vector):
	return sum([x ** 2 for x in vector])

def random_vector(minmax):
	return [v[0] + ((v[1] - v[0]) * random.random())
		for i, v in enumerate(minmax)]

def create_particle(search_space, vel_space):
	particle = {}
	particle['position'] = random_vector(search_space)
	particle['cost'] = objective_function(particle['position'])
	particle['best_position'] = particle['position'][:]
	particle['best_cost'] = particle['cost']
	particle['velocity'] = random_vector(vel_space)
	return particle

# def get_global_best(population, current_best = None):
# 	sorted(population, key=lambda x: x['cost'] < y['cost'])

def main():
	print(random_vector([-5, 5]))

main()
