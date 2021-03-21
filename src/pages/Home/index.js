import React, { useEffect, useRef, useState } from 'react'
import { useWindowWidth, useWindowHeight } from '@react-hook/window-size'

import Select from 'react-select'
import { InlineIcon } from '@iconify/react'
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader'
import { UncontrolledReactSVGPanZoom, TOOL_PAN } from 'react-svg-pan-zoom'

import bxTrain from '@iconify/icons-bx/bx-train'
import bxInfo from '@iconify/icons-bx/bx-info-circle'
import bxCaptions from '@iconify/icons-bx/bx-captions'
import bxsMessage from '@iconify/icons-bx/bxs-message-square-x'
import bxsCircle from '@iconify/icons-bx/bxs-circle'
import pathImage from '../../assets/img/path.png'

import { getStationsList } from '../../utils/otherUtils'
import { getInstructions } from '../../utils/getInstructions'

const options = getStationsList()

const captions = [
  { color: '#003C86', label: 'Linha 1 - Azul' },
  { color: '#006D58', label: 'Linha 2 - Verde' },
  { color: '#EF4035', label: 'Linha 3 - Vermelha' },
  { color: '#FCBD0F', label: 'Linha 4 - Amarela' },
  { color: '#96387F', label: 'Linha 5 - Lilás' },
  { color: '#808080', label: 'Linha 15 - Prata' },
]

const Home = () => {
  const [partida, setPartida] = useState({ value: -1, label: 'Partida' })
  const [destino, setDestino] = useState({ value: -1, label: 'Destino' })
  const [startTime, setStartTime] = useState(300)
  const [error, setError] = useState('')
  const [instructions, setInstructions] = useState([])
  const [showModal, setShowModal] = useState(false)

  const map = useRef()
  const width = useWindowWidth() - 300
  const height = useWindowHeight()

  const travelError = (message) => {
    if (message) {
      setError(message)
    } else if (partida.value !== -1 && partida.value === destino.value) {
      setError('A partida e o destino não podem ser iguais.')
    } else {
      setError('')
    }
  }

  const handleTravel = () => {
    if (partida.value === -1 || destino.value === -1) {
      travelError('Selecione a partida e o destino.')
      return
    }
    if (partida.value === destino.value) {
      return
    }

    const travel = getInstructions(partida.value, destino.value, startTime)
    setInstructions(travel)
  }

  useEffect(() => {
    travelError()
  }, [partida, destino])

  useEffect(() => {
    map.current.zoom(width / 2, height / 2, 1.4)

    setInstructions([
      'Digite a estação de partida e a de destino para receber o trajeto.',
    ])

    setTimeout(() => {
      setShowModal(true)
    }, 500)
  }, [])

  return (
    <div className='container'>
      {/* sidebar */}
      <div className='sidebar'>
        <div className='metro'>
          <div className='project'>
            <InlineIcon
              icon={bxTrain}
              style={{ color: '#fff', fontSize: '25px' }}
            />
            <div className='title'>
              <h1>Metrô de SP</h1>
              <h4>São Paulo, Brasil</h4>
            </div>
          </div>
          <div className='travel'>
            <div className='travel-icon'>
              <img src={pathImage} height={65} alt='path' />
            </div>
            <div className='travel-choices'>
              <div className='choice'>
                <Select
                  className='travel_select_container'
                  classNamePrefix='travel_select'
                  value={partida}
                  options={options}
                  onChange={(option) => setPartida(option)}
                />
              </div>
              <div className='choice'>
                <input
                  type='time'
                  className='time_select'
                  min='05:00'
                  max='23:59'
                  defaultValue='05:00'
                  onChange={(option) => {
                    const time = option.target.value.split(':')
                    const minutes =
                      parseInt(time[0], 10) * 60 + parseInt(time[1], 10)

                    setStartTime(minutes)
                  }}
                />
              </div>
              <div className='choice'>
                <Select
                  className='travel_select_container'
                  classNamePrefix='travel_select'
                  value={destino}
                  options={options}
                  onChange={(option) => setDestino(option)}
                />
              </div>
            </div>
          </div>
          <div className={`travel-error ${error ? 'has-error' : ''}`}>
            <p>{error}</p>
          </div>
          <div className='travel-submit'>
            <button type='button' onClick={handleTravel}>
              Buscar
            </button>
          </div>
        </div>
        <div className='instructions'>
          <div>
            <div className='white-box'>
              <div className='title'>
                <InlineIcon
                  icon={bxInfo}
                  style={{ color: '#231F20', fontSize: '25px' }}
                />
                <h2>Instruções</h2>
              </div>
              <div className='content'>
                {instructions.map((instruction, index) => {
                  const key = index + 1
                  if (instructions.length > 1) {
                    return (
                      <p key={key}>
                        <span>{key}.</span> {instruction[0]}{' '}
                        <span>{instruction[1]}</span>
                      </p>
                    )
                  }
                  return <p key={key}>{instruction}</p>
                })}
              </div>
            </div>
            <div className='white-box'>
              <div className='title'>
                <InlineIcon
                  icon={bxCaptions}
                  style={{ color: '#231F20', fontSize: '25px' }}
                />
                <h2>Legenda</h2>
              </div>
              <div className='captions'>
                {captions.map((caption) => (
                  <div className='caption' key={caption.label}>
                    <div className='symbol'>
                      <InlineIcon
                        icon={bxsCircle}
                        style={{ color: caption.color, fontSize: '20px' }}
                      />
                    </div>
                    <div className='text'>
                      <p>{caption.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* map area */}
      <div className='map-area'>
        <ReactSvgPanZoomLoader
          src='metro-sp.svg'
          render={(content) => (
            <UncontrolledReactSVGPanZoom
              ref={map}
              className='map'
              width={width}
              height={height}
              defaultTool={TOOL_PAN}
              scaleFactorMin={0.8}
              scaleFactorMax={5}
              background='#e5e5e5'
              SVGBackground='#e5e5e5'
              customMiniature={() => null}
            >
              <svg width={width} height={height}>
                {content}
              </svg>
            </UncontrolledReactSVGPanZoom>
          )}
        />
      </div>

      <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
        <div className='modal'>
          <div className='modal-header'>
            <h5 className='modal-title'>Horários de metrô</h5>
            <InlineIcon
              icon={bxsMessage}
              style={{ color: '#fff', fontSize: '25px' }}
              onClick={() => setShowModal(false)}
            />
          </div>
          <div className='modal-body'>
            <p>
              As viagens realizadas dependem dos horários organizados dos
              metrôs. Nas instruções você pode verificar o horário de embarque
              de cada um, após buscar o trajeto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
