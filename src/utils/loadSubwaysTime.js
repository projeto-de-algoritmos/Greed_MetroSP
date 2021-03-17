const fs = require('fs')

const stationsGraph = require('../assets/js/stationsGraphWeighted.json')

const loadSubwaysTime = () => {
  const ids = Object.keys(stationsGraph)
  // starts at 5am and finish at 23:59pm with a 10 minutes interval between each subway
  const startMinute = 300, endMinute = 1440, step = 10;
  for (let id of ids) {
    stationsGraph[id].times = []
    for (let time = 300; time <= 1440; time += 10) {
      stationsGraph[id].times.push({ time, subway: Math.floor(Math.random() * 3) + 1 })
    }
  }
  fs.writeFile(
    './src/assets/js/stationsGraphTimed.json',
    JSON.stringify(stationsGraph),
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Erro ao escrever JSON', err)
      } else {
        // eslint-disable-next-line no-console
        console.log('JSON escrito com sucesso')
      }
    }
  )
}

loadSubwaysTime()