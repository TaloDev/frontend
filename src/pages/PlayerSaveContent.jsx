import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import routes from '../constants/routes'
import Page from '../components/Page'

export default function PlayerSaveContent() {
  const { id: playerId } = useParams()

  const location = useLocation()
  const save = location.state?.save

  const [isLoading, setLoading] = useState(true)

  const navigate = useNavigate()

  const embedRef = useRef()

  const setContent = useCallback(() => {
    embedRef.current.contentWindow.postMessage({
      json: save.content,
      options: {
        theme: 'dark',
        direction: 'RIGHT'
      }
    }, '*')

    setLoading(false)
  }, [])

  useEffect(() => {
    if (!save) {
      navigate(routes.playerSaves.replace(':id', playerId))
    } else {
      setTimeout(() => {
        setContent()
      }, 300)
    }
  }, [save])

  return (
    <Page
      showBackButton
      title={save?.name ?? 'Save content'}
      isLoading={isLoading}
    >
      <iframe
        ref={embedRef}
        src='https://jsoncrack.com/widget'
        title='save-content'
        className='w-full h-[75vh] lg:h-[66vh] xl:h-[75vh] rounded border-2 border-gray-700 overflow-hidden'
      />
    </Page>
  )
}
