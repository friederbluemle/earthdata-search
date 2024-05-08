import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import actions from '../../actions'

import { locationPropType } from '../../util/propTypes/location'
import { getProjectCollectionsRequiringChunking } from '../../selectors/project'

import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'
import ProjectCollectionsContainer
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
import ProjectPanelsContainer from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'
import OverrideTemporalModalContainer
  from '../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'
import EdscMapContainer from '../../containers/MapContainer/MapContainer'
import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'

const mapDispatchToProps = (dispatch) => ({
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval()),
  onToggleChunkedOrderModal:
    (isOpen) => dispatch(actions.toggleChunkedOrderModal(isOpen))
})

const mapStateToProps = (state) => ({
  projectCollectionsRequiringChunking: getProjectCollectionsRequiringChunking(state),
  name: state.savedProject.name
})

export class Project extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)

    const { edscHost } = getEnvironmentConfig()
    this.edscHost = edscHost
  }

  handleSubmit(event) {
    event.preventDefault()

    const {
      onSubmitRetrieval,
      onToggleChunkedOrderModal,
      projectCollectionsRequiringChunking
    } = this.props

    if (Object.keys(projectCollectionsRequiringChunking).length > 0) {
      onToggleChunkedOrderModal(true)
    } else {
      onSubmitRetrieval()
    }
  }

  render() {
    const {
      location,
      name
    } = this.props
    const { search } = location
    const { edscHost } = this

    // If there are no project params in the URL, re-route to the saved Projects page
    if (search === '') {
      return (
        <Redirect to="/saved-projects" />
      )
    }

    // Show the project page
    return (
      <AuthRequiredContainer>
        <Helmet>
          <title>{name || 'Untitled Project'}</title>
          <meta name="title" content={name || 'Untitled Project'} />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="canonical" href={`${edscHost}`} />
        </Helmet>
        <form
          id="form__project"
          onSubmit={this.handleSubmit}
          method="post"
          className="route-wrapper route-wrapper--project"
        >
          <SidebarContainer
            panels={<ProjectPanelsContainer />}
          >
            <ProjectCollectionsContainer />
          </SidebarContainer>
          <OverrideTemporalModalContainer />
        </form>
        <EdscMapContainer />
      </AuthRequiredContainer>
    )
  }
}

Project.propTypes = {
  location: locationPropType.isRequired,
  name: PropTypes.string.isRequired,
  projectCollectionsRequiringChunking: PropTypes.shape({}).isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Project)
)
