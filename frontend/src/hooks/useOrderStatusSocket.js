/**
 * Hook for real-time order status updates via Socket.io
 */
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export function useOrderStatusSocket(onUpdate) {
  useEffect(() => {
    const socket = io(window.location.origin.replace(':5173', ':5000'), { transports: ['websocket', 'polling'] })
    socket.on('orderStatusUpdated', onUpdate)
    return () => socket.disconnect()
  }, [onUpdate])
}
