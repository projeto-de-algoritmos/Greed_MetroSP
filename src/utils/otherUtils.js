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
