const fs = require('fs')

const stationsGraph = require('../assets/js/stationsGraph.json')

const loadStationsWeighted = () => {
  const stationsGraphWeighted = { ...stationsGraph }
  console.log(stationsGraph)
  for (let id of Object.keys(stationsGraphWeighted)) {
    let auxEdges = []
    stationsGraphWeighted[id].neighboringStations.forEach((neigh) => {
      let auxEdge = { weight: Math.floor(Math.random() * 10) + 1, node: neigh }
      auxEdges.push(auxEdge)
    })
    stationsGraphWeighted[id].neighboringStations = auxEdges
  }
  fs.writeFile(
    './src/assets/js/stationsGraphWeighted.json',
    JSON.stringify(stationsGraphWeighted),
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

const fixEdges = () => {
  let allEdges = []
  for (let id of Object.keys(sw)) {
    for (let edge of sw[id].neighboringStations) {
      let auxEdge = { from: id, to: edge.node, weight: edge.weight }
      if (allEdges.find(e => (e.from == id && e.to == edge.node) || (e.from == edge.node && e.to == id)) === undefined) {
        allEdges.push(auxEdge)
      }
    }
  }

  let ausSw = { ...sw }
  for (let id of Object.keys(ausSw)) {
    ausSw[id].neighboringStations = []
  }

  for (let edge of allEdges) {
    ausSw[edge.from].neighboringStations.push({ node: parseInt(edge.to), weight: edge.weight })
    ausSw[edge.to].neighboringStations.push({ node: parseInt(edge.from), weight: edge.weight })
  }

  fs.writeFile(
    './src/utils/aaaaa.json',
    JSON.stringify(ausSw),
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