const canvas = document.getElementById('canvas')
canvas.height = window.innerHeight
canvas.width = window.innerWidth
// canvas.style.background = 'red'
const context = canvas.getContext('2d')
context.fillStyle = 'white'
context.fillRect(0, 0, window.innerWidth, window.innerHeight)

const RADIUS = 5
const MULTIPLIER = 2
function draw ({values, cost, i}) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight)
  context.fillText(`Iteration: ${i} Score: ${cost}`, 20, 20)
  values.forEach(([x, y], j) => {
    context.beginPath()
    context.arc(x / MULTIPLIER, y / MULTIPLIER, RADIUS, 0, 2 * Math.PI)
    context.fillStyle = 'black'
    context.fill()
    if (values[j + 1]) {
      const [x1, y1] = values[j + 1]
      context.lineTo(x1 / MULTIPLIER, y1 / MULTIPLIER)
      if (j === values.length - 2) {
        const [x1, y1] = values[0]
        context.lineTo(x1 / MULTIPLIER, y1 / MULTIPLIER)
      }
      context.strokeStyle = '#888888'
      context.stroke()
    }
  })

  context.closePath()
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
  const output = []
  const best = search(berlin52, maxIt, numAnts, decay, cHeur, cLocalPhero, cGreed, ({vector, cost}) => {
    const values = vector.map(point => berlin52[point])
    output.push({ values, cost })
  })

  output.forEach(({ values, cost }, i) => {
    ((_i) => {
      window.setTimeout(() => {
        draw({ values, cost, i: _i })
      }, _i * 250)
    })(i)
  })
  console.log(`Done. Best Solution: c=${best.cost}, v=${best.vector}`)
}

main()
