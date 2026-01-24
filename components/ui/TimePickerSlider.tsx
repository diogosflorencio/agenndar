'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimePickerSliderProps {
  value: string // Formato HH:mm
  onChange: (time: string) => void
  min?: string // Hora mínima (ex: "08:00")
  max?: string // Hora máxima (ex: "18:00")
  step?: number // Intervalo em minutos (padrão: 30)
  disabled?: boolean
}

export default function TimePickerSlider({
  value,
  onChange,
  min = "08:00",
  max = "18:00",
  step = 30,
  disabled = false,
}: TimePickerSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Converter hora para minutos desde meia-noite
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Converter minutos para hora
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const minMinutes = timeToMinutes(min)
  const maxMinutes = timeToMinutes(max)
  const currentMinutes = timeToMinutes(value)
  const totalMinutes = maxMinutes - minMinutes
  const steps = Math.floor(totalMinutes / step)
  const currentStep = Math.round((currentMinutes - minMinutes) / step)

  // Calcular posição do slider (0 a 100%)
  const position = (currentStep / steps) * 100

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    handleMove(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    setIsDragging(true)
    handleMove(e.touches[0].clientX)
  }

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    
    const stepIndex = Math.round((percentage / 100) * steps)
    const clampedStep = Math.max(0, Math.min(steps, stepIndex))
    const newMinutes = minMinutes + (clampedStep * step)
    const newTime = minutesToTime(newMinutes)

    onChange(newTime)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Gerar opções de horário
  const timeOptions: string[] = []
  for (let minutes = minMinutes; minutes <= maxMinutes; minutes += step) {
    timeOptions.push(minutesToTime(minutes))
  }

  return (
    <div className="w-full">
      {/* Display do horário selecionado */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-primary mb-2">{value}</div>
        <p className="text-sm text-text-muted">Deslize para escolher o horário</p>
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="relative w-full h-2 bg-surface border border-surface-border rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track */}
        <div className="absolute inset-0 rounded-full" />
        
        {/* Active track */}
        <motion.div
          className="absolute h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${position}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 size-6 bg-primary rounded-full shadow-glow cursor-grab active:cursor-grabbing"
          initial={false}
          animate={{ left: `calc(${position}% - 12px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Marcadores de hora */}
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
          {timeOptions.map((time, index) => {
            const isMajor = index % 2 === 0 || index === timeOptions.length - 1
            return (
              <div
                key={time}
                className={`flex flex-col items-center ${
                  isMajor ? 'h-3' : 'h-2'
                }`}
                style={{ left: `${(index / (timeOptions.length - 1)) * 100}%` }}
              >
                <div
                  className={`w-0.5 bg-surface-border ${
                    isMajor ? 'h-3' : 'h-2'
                  }`}
                />
                {isMajor && (
                  <span className="text-[10px] text-text-muted mt-1 -translate-x-1/2">
                    {time.substring(0, 5)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Opções rápidas */}
      <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-2">
        {timeOptions.filter((_, i) => i % 2 === 0).map((time) => (
          <button
            key={time}
            onClick={() => !disabled && onChange(time)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              value === time
                ? 'bg-primary text-background-dark'
                : 'bg-surface border border-surface-border text-white hover:bg-surface-border'
            }`}
            disabled={disabled}
          >
            {time.substring(0, 5)}
          </button>
        ))}
      </div>
    </div>
  )
}

