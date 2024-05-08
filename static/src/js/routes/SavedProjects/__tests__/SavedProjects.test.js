import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import * as AppConfig from '../../../../../../sharedUtils/config'
import SavedProjects from '../SavedProjects'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => { }),
  createControlComponent: jest.fn().mockImplementation(() => { })
}))

jest.mock('../../../containers/AuthRequiredContainer/AuthRequiredContainer', () => jest.fn(({ children }) => (
  <mock-auth-container>{children}</mock-auth-container>
)))

jest.mock('react-helmet', () => {
  // Disabling the no-shadow rule for this one line as the mock needs to create a react element and it cannot use an outer scope varible to do that.
  // eslint-disable-next-line no-shadow
  const React = jest.requireActual('react')
  const plugin = jest.requireActual('react-helmet')
  const mockHelmet = ({ children, ...props }) => React.createElement('div', {
    ...props,
    className: 'mock-helmet'
  }, children)

  return {
    ...plugin,
    Helmet: jest.fn().mockImplementation(mockHelmet)
  }
})

jest.mock('../../../containers/SavedProjectsContainer/SavedProjectsContainer', () => jest.fn(
  () => <>Mock Saved Projects Container</>
))

jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))

describe('SavedProjects component', () => {
  test('displays the SavedProjectsContainer', () => {
    render(
      <Router>
        <SavedProjects />
      </Router>
    )

    expect(screen.getByText('Mock Saved Projects Container')).toBeInTheDocument()
  })

  describe('helmet metadata rendered', () => {
    test('title metadata is rendered', () => {
      const { container } = render(
        <Router>
          <SavedProjects />
        </Router>
      )
      const metaEl = container.querySelector('meta[name="title"]')
      expect(metaEl).toBeInTheDocument()
    })

    test('metadata robots is rendered', () => {
      const { container } = render(
        <Router>
          <SavedProjects />
        </Router>
      )
      const metaEl = container.querySelector('meta[name="robots"]')
      expect(metaEl).toBeInTheDocument()
    })

    test('link is properly rendered', () => {
      const { container } = render(
        <Router>
          <SavedProjects />
        </Router>
      )
      const metaEl = container.querySelector('link[href="https://search.earthdata.nasa.gov/projects"]')
      expect(metaEl).toBeInTheDocument()
    })
  })
})
