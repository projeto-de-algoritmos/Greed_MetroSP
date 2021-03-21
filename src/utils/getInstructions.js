/* eslint-disable */
const stationsGraph = require('../assets/js/stationsGraph.json')
const { getTime } = require('./otherUtils')

const distances = new Array(150)
const parents = new Array(150)

const getSubwaysTime = (path, leaveTime) => {
  const speeds = [0.25, 0.75, 1.5]
  // Inicializa os tempos dos metrôs
  for (let j = 0; j < path.length - 1; j++) {
    path[j].times = []
    for (let time = leaveTime; time < 1440; time += 5) {
      path[j].times.push({ leaveTime: Math.floor(time), subwaySpeed: speeds[Math.floor(Math.random() * 3)] })
    }
  }

  let subwaySpeed = 1, distanceNeigh = 0

  // Percorre as estações do caminho a ser percorrido
  for (let j = 0; j < path.length - 1; j++) {

    // Calcula a distância até a próxima estação para cálculos 
    distanceNeigh = path[j].neighboringStations.find(edge => edge.node === path[j + 1].id).weight

    // Apenas fala o horário de embarque para as estações de integração,
    // pois nas outras não é necessário desembarcar para embarcar novamente
    let fastest = Number.MAX_SAFE_INTEGER
    if (path[j].lineName === 'Estação de Integração' || j === 0) {

      // ** Algoritmo Ambicioso **
      // Percorre os tempos de saída dos metrôs e verifica qual chega mais rápido na próxima estação
      for (let i = 0; i < path[j].times.length; i++) {

        // Calcula o tempo de chegada até a próxima estação com a velocidade do metrô atual
        let travelTime = distanceNeigh / path[j].times[i].subwaySpeed
        let arrivalTime = travelTime + path[j].times[i].leaveTime

        if (path[j].times[i].leaveTime >= leaveTime) {
          // Se chega mais rápido, ele atualiza as informações necessárias
          if (arrivalTime < fastest) {
            fastest = arrivalTime
            subwaySpeed = path[j].times[i].subwaySpeed
            path[j].boardingTime = path[j].times[i].leaveTime
          }
        }
      }
    }
    // Calcula o tempo de viagem em cada estação
    leaveTime += distanceNeigh / subwaySpeed
    path[j].arrivalTime = leaveTime
  }
  return path
}

const buildPath = (startStation, endStation, leaveTime) => {
  let path = []
  let parent = stationsGraph[endStation].id

  while (parent !== stationsGraph[startStation].id) {
    path.unshift(stationsGraph[parent])
    parent = parents[parent]
  }
  path.unshift(stationsGraph[parent])

  return getSubwaysTime(path, leaveTime)
}

const getMessages = (startStation, endStation, leaveTime) => {
  let path = buildPath(startStation, endStation, leaveTime)

  let mensagens = []

  mensagens.push([`Embarque em ${path[0].stationName} sentido à estação ${path[1].stationName} no metrô de`, `${getTime(path[0].boardingTime)}`])
  for (let i = 1; i < path.length - 1; i += 1) {
    if (path[i].lineName === 'Estação de Integração') {
      mensagens.push([`Na estação ${path[i].stationName} siga sentido à estação ${path[i + 1].stationName} com o metrô de`, `${getTime(path[i].boardingTime)}`])
    }
  }
  mensagens.push([`Desembarque em ${path[path.length - 1].stationName}`])

  return mensagens
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
  return { currentNode: stationsGraph[minNode], index: indexMinNode }
}

const Dijkstra = (startStation, endStation) => {
  const queue = []

  Object.keys(stationsGraph).forEach(station => {
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
    if (currentNode.id === endStation) {
      return true
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

  return false
}

export const getInstructions = (startStation, endStation, leaveTime) => {
  if (!Dijkstra(startStation, endStation)) {
    return ['Rota não encontrada']
  }

  return getMessages(startStation, endStation, leaveTime)
}