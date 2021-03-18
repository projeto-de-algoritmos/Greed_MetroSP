/* eslint-disable */
const stationsGraph = require('../assets/js/stationsGraph.json')

export const getStationsList = () => {
  const ids = Object.keys(stationsGraph)
  return ids.map(
    (stationId) => {
      return {
        value: parseInt(stationId, 10),
        label: stationsGraph[stationId].stationName,
      }
    })
}

const getTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60)
  let minutes = totalMinutes % 60
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  return `${hours}:${minutes}`
}
