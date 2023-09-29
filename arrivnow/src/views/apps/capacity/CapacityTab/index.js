// ** React Imports
import { Fragment, useState } from 'react'

// ** Chat App Component Imports
import BusLog from './buses'
import RoutesPanel from './routes'

// ** Third Party Components
import classnames from 'classnames'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'

const CapacityPanel = () => {
  const [sidebar, setSidebar] = useState(false)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar)
  const handleOverlayClick = () => {
    setSidebar(false)
    setUserSidebarRight(false)
    setUserSidebarLeft(false)
  }

  return (
    <Fragment>
      <RoutesPanel
        sidebar={sidebar}
        handleSidebar={handleSidebar}
      />
      <div className='content-right float_box'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: userSidebarRight === true || sidebar === true || userSidebarLeft === true
              })}
              onClick={handleOverlayClick}
            ></div>
            <div className='chat-app-window'>

            <BusLog />
            </div>
            
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CapacityPanel
