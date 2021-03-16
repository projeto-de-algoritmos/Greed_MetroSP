/* eslint-disable */
const stationsGraph = require('../assets/js/stationsGraph.json')
const stationsGraphWeighted = require('../assets/js/stationsGraphWeighted.json')

const distances = new Array(150)
const parents = new Array(150)
const visited = new Array(150)

const buildPath = (startStation, endStation, graph) => {
  const path = []
  let parent = graph[endStation].id

  while (parent !== graph[startStation].id) {
    path.unshift(graph[parent])
    parent = parents[parent]
  }
  path.unshift(graph[parent])
  return path
}

const getMessages = (startStation, endStation, graph) => {
  let path = buildPath(startStation, endStation, graph)

  let mensagens = []

  mensagens.push(`Embarque em ${path[0].stationName} sentido à estação ${path[1].stationName}`)
  for (let i = 1; i < path.length - 1; i += 1) {
    if (path[i].lineName === 'Estação de Integração') {
      mensagens.push(`Na estação ${path[i].stationName} siga sentido à estação ${path[i + 1].stationName}`)
    }
  }
  mensagens.push(`Desembarque em ${path[path.length - 1].stationName}`)

  return mensagens
}

const BFS = (startStation, endStation) => {
  const queue = []

  queue.push(stationsGraph[startStation])
  parents.fill(-1)
  visited.fill(false)

  visited[startStation] = true

  while (queue.length > 0) {
    const currentNode = queue[0]
    queue.shift()

    if (currentNode.id === endStation) {
      return true
    }

    currentNode.neighboringStations.forEach((neigh) => {
      if (visited[neigh] === false) {
        parents[neigh] = currentNode.id

        visited[neigh] = true
        queue.push(stationsGraph[neigh])
      }
    })
  }

  return false
}

const findMinNode = (queue) => {
  let minNode = queue[0]
  let index = 0, indexMinNode = 0;
  for (let station of queue) {
    if (distances[station] < distances[minNode]) {
      minNode = station
      indexMinNode = index
    }
    index++;
  }
  return { currentNode: stationsGraphWeighted[minNode], index: indexMinNode }
}

const Dijkstra = (startStation, endStation) => {
  const queue = []

  Object.keys(stationsGraphWeighted).forEach(station => {
    if (station.id !== startStation) {
      queue.push(station)
    }
    distances[station] = Infinity
    parents[station] = -1
  })

  distances.fill(Infinity)
  parents.fill(-1)

  distances[startStation] = 0

  while (queue.length > 0) {
    const { currentNode, index } = findMinNode(queue);
    if (currentNode.id === 23) {
      return
    }
    queue.splice(index, 1)

    currentNode.neighboringStations.forEach((neigh) => {
      const alt = distances[currentNode.id] + neigh.weight
      if (alt < distances[neigh.node]) {
        distances[neigh.node] = alt
        parents[neigh.node] = currentNode.id
      }
    })
  }
}

export const getInstructions = (startStation, endStation, isDijkstra) => {
  isDijkstra ? Dijkstra(startStation, endStation) : BFS(startStation, endStation)

  return getMessages(startStation, endStation, isDijkstra ? stationsGraphWeighted : stationsGraph)
}