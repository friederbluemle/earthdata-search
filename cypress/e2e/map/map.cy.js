import { getByTestId } from '../../support/getByTestId'
import { interceptUnauthenticatedCollections } from '../../support/interceptUnauthenticatedCollections'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'

import boundingBoxBody from './__mocks__/bounding_box_collections.body.json'
import circleBody from './__mocks__/circle_collections.body.json'
import cmrGranulesBody from './__mocks__/cmr_granules/granules.body.json'
import cmrGranulesCollectionBody from './__mocks__/cmr_granules/collections.body.json'
import cmrGranulesCollectionGraphQlBody from './__mocks__/cmr_granules/collection_graphql.body.json'
import granuleGraphQlBody from './__mocks__/cmr_granules/granule_graphql.body.json'
import cmrGranulesCollectionGraphQlHeaders from './__mocks__/cmr_granules/graphql.headers.json'
import cmrGranulesHeaders from './__mocks__/cmr_granules/granules.headers.json'
import commonBody from './__mocks__/common_collections.body.json'
import commonHeaders from './__mocks__/common_collections.headers.json'
import multipleShapesShapefileBody from './__mocks__/multiple_shapes_shapefile_collections.body.json'
import opensearchGranulesBody from './__mocks__/opensearch_granules/granules_body'
import opensearchGranulesCollectionBody from './__mocks__/opensearch_granules/collections.body.json'
import opensearchGranulesCollectionGraphQlBody from './__mocks__/opensearch_granules/graphql.body.json'
import opensearchGranulesCollectionGraphQlHeaders from './__mocks__/opensearch_granules/graphql.headers.json'
import opensearchGranulesHeaders from './__mocks__/opensearch_granules/granules.headers.json'
import opensearchGranulesTimelineBody from './__mocks__/opensearch_granules/timeline.body.json'
import opensearchGranulesTimelineHeaders from './__mocks__/opensearch_granules/timeline.headers.json'
import pointBody from './__mocks__/point_collections.body.json'
import pointBodyEdited from './__mocks__/point_collections_edited.body.json'
import polygonBody from './__mocks__/polygon_collections.body.json'
import simpleShapefileBody from './__mocks__/simple_shapefile_collections.body.json'
import tooManyPointsShapefileBody from './__mocks__/too_many_points_shapefile_collections.body.json'
import arcticShapefileBody from './__mocks__/arctic_shapefile_collections.body.json'
import antarcticShapefileBody from './__mocks__/antarctic_shapefile_collections.body.json'

describe('Map interactions', () => {
  describe('When drawing point spatial', () => {
    describe('When drawing a new point from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42.1875,-4.75606&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Add the point to the map
        cy.get('.map').click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42.1875%2C-4.75606')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1000px, 451px, 0px); z-index: 451;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-4.75606,42.1875')
      })
    })

    describe('When drawing a new point from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42.1875,-4.75606&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        cy.get('.leaflet-draw-draw-marker').click({ force: true })

        // Add the point to the map
        cy.get('.map').click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42.1875%2C-4.75606')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(1000px, 451px, 0px); z-index: 451;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-4.75606,42.1875')
      })
    })

    describe('When typing a new point in the spatial display', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42.1875,-2.40647&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Enter the spatial point
        getByTestId('spatial-display_point').type('-2.40647,42.1875{enter}')

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42.1875%2C-2.40647&lat=-2.40647&long=42.1875&zoom=7')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(700px, 418px, 0px); z-index: 418;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-2.40647,42.1875')
      })
    })

    // This isn't working because cypress is unable to drag the edit icons for the leaflet-draw shape
    describe.skip('When editing a point', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointAlias',
            body: pointBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42.1875,-2.40647&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          },
          {
            alias: 'pointEditedAlias',
            body: pointBodyEdited,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=42,-2&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the point spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Point').click()
        })

        // Add the point to the map
        cy.get('.map').click(1000, 450)

        // Edit the point
        cy.get('.leaflet-draw-edit-edit').click()

        cy.get('.leaflet-edit-marker-selected')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 1000,
            clientY: 450,
            force: true
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 1200,
            clientY: 450,
            force: true
          })
          .trigger('pointerup', {
            pointerId: 1,
            force: true
          })
        cy.get('.leaflet-draw-actions').within(() => {
          cy.contains('Save').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=42%2C-2')

        // draws a point on the map
        cy.get('.leaflet-marker-pane img').should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(700px, 433px, 0px); z-index: 433;')

        // populates the spatial display field
        getByTestId('spatial-display_point').should('have.value', '-2,42')
      })
    })
  })

  describe('When drawing circle spatial', () => {
    describe('When drawing a new circle from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleAlias',
            body: circleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5157'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&circle[]=42.1875,4.5297,156444&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the circle spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Circle').click()
        })

        // Add the circle to the map
        cy.get('.map')
          .trigger('mousedown', {
            pointerId: 1,
            clientX: 1000,
            clientY: 450,
            force: true
          })
          .trigger('mousemove', {
            pointerId: 1,
            clientX: 1000,
            clientY: 460,
            force: true
          })
          .trigger('mouseup', { pointerId: 1, force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=42.1875%2C4.5297%2C156444')

        // draws a circle on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M990,384.78877260643276a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 ')

        // populates the spatial display field
        getByTestId('spatial-display_circle-center').should('have.value', '4.5297,42.1875')
        getByTestId('spatial-display_circle-radius').should('have.value', '156444')
      })
    })

    describe('When drawing a new circle from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleAlias',
            body: circleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5157'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&circle[]=42.1875,4.5297,156444&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the circle spatial type
        cy.get('.leaflet-draw-draw-circle').click({ force: true })

        // Add the circle to the map
        cy.get('.map')
          .trigger('mousedown', {
            pointerId: 1,
            clientX: 1000,
            clientY: 450,
            force: true
          })
          .trigger('mousemove', {
            pointerId: 1,
            clientX: 1000,
            clientY: 460,
            force: true
          })
          .trigger('mouseup', { pointerId: 1, force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=42.1875%2C4.5297%2C156444')

        // draws a circle on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M990,384.78877260643276a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 ')

        // populates the spatial display field
        getByTestId('spatial-display_circle-center').should('have.value', '4.5297,42.1875')
        getByTestId('spatial-display_circle-radius').should('have.value', '156444')
      })
    })

    describe('When typing a new circle in the spatial display', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleAlias',
            body: circleBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5157'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&circle[]=42.1875,2.2329,156326&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the circle spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Circle').click()
        })

        // Enter the circle values
        getByTestId('spatial-display_circle-center').type('2.2329,42.1875')
        getByTestId('spatial-display_circle-radius').type('156326{enter}')

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=42.1875%2C2.2329%2C156326&lat=2.2329000000000008&long=42.187500000000014&zoom=6')

        // draws a circle on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M540,417.9455999999991a160,160 0 1,0 320,0 a160,160 0 1,0 -320,0 ')

        // populates the spatial display field
        getByTestId('spatial-display_circle-center').should('have.value', '2.2329,42.1875')
        getByTestId('spatial-display_circle-radius').should('have.value', '156326')
      })
    })

    describe.skip('When editing a circle', () => {})
  })

  describe('When drawing bounding box spatial', () => {
    describe('When drawing a new bounding box from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'boundingBoxAlias',
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&bounding_box[]=42.1875,-18.82541,56.25,-4.75606&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the bounding box spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Rectangle').click()
        })

        // Add the bounding box to the map
        // The test seems to be clicking the map too fast, causing it to zoom. These waits ensure each click places
        // a new point on the map
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('.map')
          .click(1000, 450)
          .wait(100)
          .click(1100, 550)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sb[0]=42.1875%2C-18.82541%2C56.25%2C-4.75606')

        // draws a bounding box on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 551L1000 451L1100 451L1100 551L1000 551z')

        // populates the spatial display field
        getByTestId('spatial-display_southwest-point').should('have.value', '-18.82541,42.1875')
        getByTestId('spatial-display_northeast-point').should('have.value', '-4.75606,56.25')
      })
    })

    describe('When drawing a new bounding box from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'boundingBoxAlias',
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&bounding_box[]=42.1875,-18.82541,56.25,-4.75606&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the bounding box spatial type
        cy.get('.leaflet-draw-draw-rectangle').click({ force: true })

        // Add the bounding box to the map
        // The test seems to be clicking the map too fast, causing it to zoom. These waits ensure each click places
        // a new point on the map
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('.map')
          .click(1000, 450)
          .wait(100)
          .click(1100, 550)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sb[0]=42.1875%2C-18.82541%2C56.25%2C-4.75606')

        // draws a bounding box on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 551L1000 451L1100 451L1100 551L1000 551z')

        // populates the spatial display field
        getByTestId('spatial-display_southwest-point').should('have.value', '-18.82541,42.1875')
        getByTestId('spatial-display_northeast-point').should('have.value', '-4.75606,56.25')
      })
    })

    describe('When typing a new bounding box in the spatial display', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'boundingBoxAlias',
            body: boundingBoxBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5151'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&bounding_box[]=42.1875,-16.46517,56.25,-2.40647&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the bounding box spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Rectangle').click()
        })

        // Enter the bounding box values
        getByTestId('spatial-display_southwest-point').type('-16.46517,42.1875')
        getByTestId('spatial-display_northeast-point').type('-2.40647,56.25{enter}')

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sb[0]=42.1875%2C-16.46517%2C56.25%2C-2.40647&lat=-9.43582&long=49.21875&zoom=4')

        // draws a bounding box on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M500 617L500 217L900 217L900 617L500 617z')

        // populates the spatial display field
        getByTestId('spatial-display_southwest-point').should('have.value', '-16.46517,42.1875')
        getByTestId('spatial-display_northeast-point').should('have.value', '-2.40647,56.25')
      })
    })

    describe.skip('When editing a bounding box', () => {})
  })

  describe('When drawing polygon spatial', () => {
    describe('When drawing a new polygon from the spatial selection', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: polygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5160'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=42.1875,-4.75606,42.1875,-18.82541,56.25,-18.82541,42.1875,-4.75606&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the polygon spatial type
        getByTestId('spatial-selection-dropdown').click()
        getByTestId('spatial-selection-dropdown').within(() => {
          cy.contains('Polygon').click()
        })

        // Add the polygon to the map
        // The test seems to be clicking the map too fast, causing it to zoom. These waits ensure each click places
        // a new point on the map
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('.map')
          .click(1000, 450)
          .wait(100)
          .click(1100, 550)
          .wait(100)
          .click(1000, 550)
          .wait(100)
          .click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-4.75606%2C42.1875%2C-18.82541%2C56.25%2C-18.82541%2C42.1875%2C-4.75606')

        // draws a polygon on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 451L1100 551L1000 551L1000 451z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Polygon')
        getByTestId('spatial-display_polygon').should('have.text', '3 Points')
      })
    })

    describe('When drawing a new polygon from the leaflet controls', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: polygonBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5160'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=42.1875,-4.75606,42.1875,-18.82541,56.25,-18.82541,42.1875,-4.75606&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.visit('/')

        // Select the polygon spatial type
        cy.get('.leaflet-draw-draw-polygon').click({ force: true })

        // Add the polygon to the map
        // The test seems to be clicking the map too fast, causing it to zoom. These waits ensure each click places
        // a new point on the map
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('.map')
          .click(1000, 450)
          .wait(100)
          .click(1100, 550)
          .wait(100)
          .click(1000, 550)
          .wait(100)
          .click(1000, 450)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-4.75606%2C42.1875%2C-18.82541%2C56.25%2C-18.82541%2C42.1875%2C-4.75606')

        // draws a polygon on the map
        cy.get('.leaflet-interactive').should('have.attr', 'd', 'M1000 451L1100 551L1000 551L1000 451z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Polygon')
        getByTestId('spatial-display_polygon').should('have.text', '3 Points')
      })
    })

    describe.skip('When editing a polygon', () => {})
  })

  describe('When uploading a shapefile', () => {
    describe('When the shapefile has a single polygon shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: simpleShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5160'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647,42.1875,-16.46517&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/simple.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')
        // After the react update, I needed to put this wait in or the test stalled and never moved on
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1)

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/simple.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&sf=1&sfs[0]=0&lat=-9.435819999999993&long=49.21875&zoom=5')

        // draws a polygon on the map
        cy.get('.leaflet-interactive').first().should('have.attr', 'd', 'M300 18L300 818L600 824L900 823L1100 818L996 720L792 522L692 422L300 18z')
        cy.get('.leaflet-interactive').last().should('have.attr', 'd', 'M300 818L600 824L900 823L1100 818L996 720L792 522L692 422L300 18L300 818z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'simple.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has a line shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'lineShapeAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&line[]=31,-15,36,-17,41,-15&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select the line
        cy.get('.leaflet-interactive').eq(2).click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?line[0]=31%2C-15%2C36%2C-17%2C41%2C-15&sf=1&sfs[0]=2&lat=-8.296765000000008&long=44.625&zoom=4')

        // draws the shapes on the map
        // Line
        cy.get('.leaflet-interactive').eq(2).should('have.attr', 'd', 'M313 609L455 666L597 609')

        // Selected Line
        cy.get('.leaflet-interactive').eq(4).should('have.attr', 'd', 'M313 609L455 666L597 609')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has a circle shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'circleShapeAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&circle[]=35,-5,50000&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select the circle
        cy.get('.leaflet-interactive').eq(3).click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?circle[0]=35%2C-5%2C50000&sf=1&sfs[0]=3&lat=-8.296765000000008&long=44.625&zoom=4')

        // draws the shapes on the map
        // Circle
        cy.get('.leaflet-interactive').eq(3).should('have.attr', 'd', 'M413.55555555555566,324.2222222222222a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 ')

        // Selected Circle
        cy.get('.leaflet-interactive').eq(4).should('have.attr', 'd', 'M413.55555555555566,324.2222222222222a13,13 0 1,0 26,0 a13,13 0 1,0 -26,0 ')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has a point shape', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'pointShapeAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=35,0&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select the point
        cy.get('.leaflet-marker-icon.leaflet-interactive').click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?sp[0]=35%2C0&sf=1&sfs[0]=4&lat=-8.296765000000008&long=44.625&zoom=4')

        // draws the shapes on the map
        // Point
        cy.get('.leaflet-marker-icon.leaflet-interactive').eq(0).should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 182px, 0px); z-index: 182; outline: none;')

        // Selected point
        cy.get('.leaflet-marker-icon.leaflet-interactive').eq(1).should('have.attr', 'style', 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px; transform: translate3d(427px, 182px, 0px); z-index: 182;')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has multiple shapes selected', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'twoShapesAlias',
            body: multipleShapesShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5197'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&options[spatial][or]=true&page_num=1&page_size=20&polygon[]=42.1875,-16.46517,56.25,-16.46517,42.1875,-2.40647,42.1875,-16.46517&polygon[]=58.25,-14.46517,58.25,0.40647,44.1875,0.40647,58.25,-14.46517&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/multiple_shapes.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/multiple_shapes.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        // Select two shapes
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.get('.geojson-svg.leaflet-interactive').eq(0).click({ force: true })
          .wait(100)
        cy.get('.geojson-svg.leaflet-interactive').eq(1).click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-16.46517%2C56.25%2C-16.46517%2C42.1875%2C-2.40647%2C42.1875%2C-16.46517&polygon[1]=58.25%2C-14.46517%2C58.25%2C0.40647%2C44.1875%2C0.40647%2C58.25%2C-14.46517&sf=1&sfs[0]=0&sfs[1]=1&lat=-8.296765000000008&long=44.625&zoom=4')

        // draws the shapes on the map
        // First polygon
        cy.get('.leaflet-interactive').eq(0).should('have.attr', 'd', 'M631 250L631 650L831 654L1031 650L877 502L728 352L631 250z')

        // Second polygon
        cy.get('.leaflet-interactive').eq(1).should('have.attr', 'd', 'M688 170L786 277L985 489L1088 593L1088 170L688 170z')

        // Selected first polygon
        cy.get('.leaflet-interactive').eq(4).should('have.attr', 'd', 'M631 650L831 654L1031 650L877 502L728 352L631 250L631 650z')

        // Selected second polygon
        cy.get('.leaflet-interactive').eq(5).should('have.attr', 'd', 'M1088 593L1088 170L688 170L786 277L985 489L1088 593z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'multiple_shapes.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '2 shapes selected')
      })
    })

    describe('When the shapefile has a polygon with too many points', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: tooManyPointsShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5479'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=-114.04999,36.95777,-114.0506,37.0004,-114.04826,41.99381,-119.99917,41.99454,-120.00101,38.99957,-118.71431,38.10218,-117.50012,37.22038,-116.0936,36.15581,-114.63667,35.00881,-114.63689,35.02837,-114.60362,35.06423,-114.64435,35.1059,-114.57852,35.12875,-114.56924,35.18348,-114.60431,35.35358,-114.67764,35.48974,-114.65431,35.59759,-114.68941,35.65141,-114.68321,35.68939,-114.70531,35.71159,-114.69571,35.75599,-114.71211,35.80618,-114.67742,35.87473,-114.73116,35.94392,-114.74376,35.9851,-114.73043,36.03132,-114.75562,36.08717,-114.57203,36.15161,-114.51172,36.15096,-114.50217,36.1288,-114.45837,36.13859,-114.44661,36.12597,-114.40547,36.14737,-114.37211,36.14311,-114.30843,36.08244,-114.31403,36.05817,-114.25265,36.02019,-114.14819,36.02801,-114.11416,36.09698,-114.12086,36.1146,-114.09987,36.12165,-114.04684,36.19407,-114.04999,36.95777&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/too_many_points.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/too_many_points.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=-114.04999%2C36.95777%2C-114.0506%2C37.0004%2C-114.04826%2C41.99381%2C-119.99917%2C41.99454%2C-120.00101%2C38.99957%2C-118.71431%2C38.10218%2C-117.50012%2C37.22038%2C-116.0936%2C36.15581%2C-114.63667%2C35.00881%2C-114.63689%2C35.02837%2C-114.60362%2C35.06423%2C-114.64435%2C35.1059%2C-114.57852%2C35.12875%2C-114.56924%2C35.18348%2C-114.60431%2C35.35358%2C-114.67764%2C35.48974%2C-114.65431%2C35.59759%2C-114.68941%2C35.65141%2C-114.68321%2C35.68939%2C-114.70531%2C35.71159%2C-114.69571%2C35.75599%2C-114.71211%2C35.80618%2C-114.67742%2C35.87473%2C-114.73116%2C35.94392%2C-114.74376%2C35.9851%2C-114.73043%2C36.03132%2C-114.75562%2C36.08717%2C-114.57203%2C36.15161%2C-114.51172%2C36.15096%2C-114.50217%2C36.1288%2C-114.45837%2C36.13859%2C-114.44661%2C36.12597%2C-114.40547%2C36.14737%2C-114.37211%2C36.14311%2C-114.30843%2C36.08244%2C-114.31403%2C36.05817%2C-114.25265%2C36.02019%2C-114.14819%2C36.02801%2C-114.11416%2C36.09698%2C-114.12086%2C36.1146%2C-114.09987%2C36.12165%2C-114.04684%2C36.19407%2C-114.04999%2C36.95777&sf=1&sfs[0]=0&lat=38.502146&long=-117.02269700000001&zoom=6')

        // displays the too many points modal
        cy.get('.edsc-modal__too-many-points-modal').within(() => {
          cy.get('.modal-title').should('have.text', 'Shape file has too many points')
        })

        // draws a polygon on the map
        cy.get('.edsc-modal__too-many-points-modal').within(() => {
          cy.get('.close').click()
        })

        cy.get('.leaflet-interactive').first().should('have.attr', 'd', 'M1039 588L1039 680L1037 680L1033 688L1030 690L1031 691L1029 697L1027 699L1016 700L1009 695L1010 693L1000 685L994 688L992 686L988 687L986 685L979 685L975 687L973 686L968 689L962 690L958 693L961 695L961 708L967 715L963 724L965 726L964 735L967 738L966 741L970 746L969 755L967 759L969 765L973 769L976 776L976 782L980 795L979 801L973 802L971 804L976 808L972 812L972 816L834 705L831 704L644 561L441 415L362 361L362 20L1039 20L1039 588z')
        cy.get('.leaflet-interactive').last().should('have.attr', 'd', 'M1039 593L1039 20L785 16L531 17L362 20L362 361L508 463L687 593L890 749L972 815L976 808L971 804L979 801L980 795L976 776L967 760L970 748L966 742L967 737L964 735L965 730L963 724L967 716L960 706L961 698L958 692L979 685L986 685L990 687L992 686L994 688L1000 685L1006 689L1012 698L1016 700L1027 699L1031 689L1039 680L1039 593z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'too_many_points.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has only arctic latitudes', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: arcticShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5479'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=42.1875,76.46517,56.25,76.46517,42.1875,82.40647,42.1875,76.46517&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/arctic.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/arctic.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C76.46517%2C56.25%2C76.46517%2C42.1875%2C82.40647%2C42.1875%2C76.46517&sf=1&sfs[0]=0&lat=90&projection=EPSG%3A3413&zoom=0')

        // draws a polygon on the map
        cy.get('.geojson-svg.leaflet-interactive').should('have.attr', 'd', 'M800 422L880 426L876 382L800 422z')
        cy.get('.leaflet-interactive').eq(0).should('have.attr', 'd', 'M880 426L876 382L800 422L880 426z')
        cy.get('.leaflet-interactive').eq(2).should('have.attr', 'd', 'M880 426L876 382L800 422L880 426z')
        cy.get('.leaflet-interactive').eq(3).should('have.attr', 'd', 'M880 426L876 382L800 422L880 426z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'arctic.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })

    describe('When the shapefile has only antarctic latitudes', () => {
      it('renders correctly', () => {
        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'polygonAlias',
            body: antarcticShapefileBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '5479'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&polygon[]=42.1875,-76.46517,42.1875,-82.40647,56.25,-76.46517,42.1875,-76.46517&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }]
        )

        cy.fixture('shapefiles/antarctic.geojson').then((fileContent) => {
          cy.intercept(
            'POST',
            '**/convert',
            {
              body: fileContent,
              headers: { 'content-type': 'application/json; charset=utf-8' }
            }
          )
        }).as('shapefileConvertRequest')

        cy.intercept(
          'POST',
          '**/shapefiles',
          {
            body: { shapefile_id: '1' },
            headers: { 'content-type': 'application/json; charset=utf-8' }
          }
        ).as('shapefilesApiRequest')

        cy.visit('/')

        // Upload the shapefile
        getByTestId('shapefile-dropzone').attachFile(
          {
            filePath: 'shapefiles/antarctic.geojson',
            mimeType: 'application/json',
            encoding: 'utf-8'
          },
          { subjectType: 'drag-n-drop' }
        )

        cy.wait('@shapefileConvertRequest')
        cy.wait('@shapefilesApiRequest')
        // Wait for the large shape to be drawn
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // updates the URL
        cy.url().should('include', '?polygon[0]=42.1875%2C-76.46517%2C42.1875%2C-82.40647%2C56.25%2C-76.46517%2C42.1875%2C-76.46517&sf=1&sfs[0]=0&lat=-90&projection=EPSG%3A3031&zoom=0')

        // draws a polygon on the map
        cy.get('.geojson-svg.leaflet-interactive').should('have.attr', 'd', 'M768 342L821 283L850 317L768 342z')
        cy.get('.leaflet-interactive').eq(0).should('have.attr', 'd', 'M821 283L768 342L850 317L821 283z')
        cy.get('.leaflet-interactive').eq(2).should('have.attr', 'd', 'M821 283L850 317L768 342L821 283z')
        cy.get('.leaflet-interactive').eq(3).should('have.attr', 'd', 'M821 283L850 317L768 342L821 283z')

        // populates the spatial display field
        getByTestId('filter-stack__spatial').get('.filter-stack-item__secondary-title').should('have.text', 'Shape File')
        getByTestId('spatial-display_shapefile-name').should('have.text', 'antarctic.geojson')
        getByTestId('filter-stack-item__hint').should('have.text', '1 shape selected')
      })
    })
  })

  describe('When moving the map', () => {
    describe('When dragging the map', () => {
      it('updates the URL with the new map parameter', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Drag the map
        cy.get('.map').dragMapFromCenter({
          yMoveFactor: 1 / 8
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?lat=14.702499871288424')
      })
    })

    describe('When zooming the map', () => {
      it('updates the URL with the new map parameter', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Zoom the map
        cy.get('.leaflet-control-zoom-in').click()

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // Ignoring the lat!lon in this param, because it doesn't always end up at 0,0
        cy.url().should('include', 'zoom=3')
      })
    })
  })

  describe('When switching projections', () => {
    describe('When switching to the North Polar Stereographic projection', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the projection
        getByTestId('projection-switcher__arctic').click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?lat=90&projection=EPSG%3A3413&zoom=0')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .first()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /epsg3413/)
            })
        })
      })
    })

    describe('When switching to the Geographic projection', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the projection
        getByTestId('projection-switcher__arctic').click({ force: true })
        // Switch back to Geographic
        getByTestId('projection-switcher__geo').click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        // Removes the map parameter when it is centered
        cy.url().should('not.include', '?m')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .first()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /epsg4326/)
            })
        })
      })
    })

    describe('When switching to the South Polar Stereographic projection', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the projection
        getByTestId('projection-switcher__antarctic').click({ force: true })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?lat=-90&projection=EPSG%3A3031&zoom=0')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .first()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /epsg3031/)
            })
        })
      })
    })
  })

  describe('When changing the map layers', () => {
    describe('When changing the base layer to Blue Marble', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the base layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Corrected Reflectance (True Color)').click()
          // Change it back to Blue Marble
          cy.contains('Blue Marble').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('not.include', '?m')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /BlueMarble_ShadedRelief_Bathymetry/)
            })
        })
      })
    })

    describe('When changing the base layer to Corrected Reflectance', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the base layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Corrected Reflectance (True Color)').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?base=trueColor')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /VIIRS_SNPP_CorrectedReflectance_TrueColor/)
            })
        })
      })
    })

    describe('When changing the base layer to Land / Water Map', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        cy.visit('/')

        // Change the base layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Land / Water Map').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?base=landWaterMap')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last()
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /OSM_Land_Water_Map/)
            })
        })
      })
    })

    describe('When changing the Borders and Roads overlay layer', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        // Visit with no overlays loaded
        cy.visit('/search?overlays=false')

        // Add the overlay layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Borders and Roads').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?overlays=referenceFeatures')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last() // the new layer will be added last
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /Reference_Features/)
            })
        })
      })
    })

    describe('When changing the Coastlines overlay layer', () => {
      it('updates the URL with the new map parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        // Visit with no overlays loaded
        cy.visit('/search?overlays=false')

        // Add the overlay layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Coastlines').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?overlays=coastlines')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last() // the new layer will be added last
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /Coastlines/)
            })
        })
      })
    })

    describe('When changing the Place Labels overlay layer', () => {
      it('updates the URL with the new map  parameter and updates the src of tile images', () => {
        const aliases = interceptUnauthenticatedCollections(commonBody, commonHeaders)

        // Visit with no overlays loaded
        cy.visit('/search?overlays=false')

        // Add the overlay layer
        cy.get('.leaflet-control-layers').rightclick()
        cy.get('.leaflet-control-layers').within(() => {
          cy.contains('Place Labels').click()
        })

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })

        cy.url().should('include', '?overlays=referenceLabels')

        cy.get('.leaflet-tile-pane').within(() => {
          cy.get('.leaflet-layer')
            .last() // the new layer will be added last
            .within(() => {
              cy.get('img.leaflet-tile')
                .first()
                .should('have.attr', 'src')
                .and('match', /Reference_Labels/)
            })
        })
      })
    })
  })

  describe('When viewing granule results', () => {
    describe('When viewing CMR granules', () => {
      beforeEach(() => {
        const conceptId = 'C1214470488-ASF'

        cy.clock(new Date(2021, 5, 1, 0, 0, 0), ['Date'])

        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'cmrGranulesCollectionAlias',
            body: cmrGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&keyword=C1214470488-ASF*&page_num=1&page_size=20&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }],
          false
        )
        cy.intercept({
          method: 'POST',
          url: '**/search/granules.json'
        },
        (req) => {
          console.log('req', req)
          expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&sort_key=-start_date')

          req.alias = 'granulesRequest'
          req.reply({
            body: cmrGranulesBody,
            headers: cmrGranulesHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/api'
        },
        (req) => {
          expect(JSON.stringify(req.body)).to.eq(graphQlGetCollection(conceptId))

          req.reply({
            body: cmrGranulesCollectionGraphQlBody,
            headers: cmrGranulesCollectionGraphQlHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/autocomplete'
        }, {
          body: { feed: { entry: [] } }
        })

        cy.visit(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!`)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
        cy.wait('@granulesRequest')
      })

      // TODO find a way to verify the granules are drawn on the map

      describe('When hovering over a granule', () => {
        beforeEach(() => {
          cy.get('.map').rightclick(1000, 450)
        })

        it('highlights the granule in the granule results list', () => {
          getByTestId('granule-results-item').should('have.class', 'granule-results-item--active')
        })
      })

      describe('When clicking on a granule', () => {
        beforeEach(() => {
          cy.intercept({
            method: 'POST',
            url: '**/api'
          },
          (req) => {
            expect(JSON.stringify(req.body)).to.eq('{"query":"\\n    query GetGranule(\\n      $id: String!\\n    ) {\\n      granule(\\n        conceptId: $id\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"id":"G2061166811-ASF"}}')

            req.reply({
              body: granuleGraphQlBody,
              headers: {
                'content-type': 'application/json'
              }
            })
          })

          cy.get('.map').click(1000, 450)
        })

        it('shows the granule and a label on the map', () => {
          cy.get('.leaflet-interactive').eq(1).should('have.attr', 'd', 'M994 441L996 454L1012 451L1009 438L994 441z')
          cy.get('.granule-spatial-label-temporal').should('have.text', '2021-05-31 15:30:522021-05-31 15:31:22')
        })

        it('focuses the selected granule', () => {
          getByTestId('granule-results-item').should('have.class', 'granule-results-item--active')
        })

        it('updates the URL', () => {
          cy.url().should('match', /\/search\/granules.*g=G2061166811-ASF/)
        })

        describe('when returning to the collections results list', () => {
          it('removes the granule label from the map', () => {
            getByTestId('breadcrumb-button').contains('Search Results').click()

            cy.get('.granule-spatial-label-temporal').should('not.exist')
          })
        })

        describe('when panning the map', () => {
          it('does not remove the stickied granule', () => {
            // Drag the map
            cy.get('.map').dragMapFromCenter({
              yMoveFactor: 1 / 8
            })

            cy.get('.leaflet-interactive').eq(1).should('have.attr', 'd', 'M994 441L996 454L1012 451L1009 438L994 441z')
            cy.get('.granule-spatial-label-temporal').should('have.text', '2021-05-31 15:30:522021-05-31 15:31:22')
          })
        })

        describe('when zooming the map', () => {
          it('does not remove the stickied granule', () => {
            // Zoom the map
            cy.get('.leaflet-control-zoom-in').click()

            cy.get('.leaflet-interactive').eq(1).should('have.attr', 'd', 'M1287 465L1293 490L1324 483L1319 458L1287 465z')
            cy.get('.granule-spatial-label-temporal').should('have.text', '2021-05-31 15:30:522021-05-31 15:31:22')
          })
        })

        describe('when clicking on an empty spot on the map', () => {
          it('removes the stickied granule', () => {
            cy.get('.map').click(1100, 720)

            cy.get('.granule-spatial-label-temporal').should('not.exist')
          })
        })

        describe('when clicking the same granule again', () => {
          it('removes the stickied granule', () => {
            cy.get('.map').click(1000, 720)

            cy.get('.granule-spatial-label-temporal').should('not.exist')
          })
        })
      })
    })

    describe('When viewing OpenSearch granules with polygon spatial', () => {
      beforeEach(() => {
        cy.clock(new Date(2021, 5, 1, 0, 0, 0), ['Date'])

        const conceptId = 'C1972468359-SCIOPS'

        const aliases = interceptUnauthenticatedCollections(
          commonBody,
          commonHeaders,
          [{
            alias: 'opensearchGranulesCollectionAlias',
            body: opensearchGranulesCollectionBody,
            headers: {
              ...commonHeaders,
              'cmr-hits': '1'
            },
            params: 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&keyword=C1972468359-SCIOPS*&page_num=1&page_size=20&polygon[]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score'
          }],
          false
        )

        cy.intercept({
          method: 'POST',
          url: '**/opensearch/granules'
        },
        (req) => {
          expect(JSON.parse(req.body).params).to.eql({
            boundingBox: '42.18750000000001,-9.453289809825428,49.218749999999986,-2.4064699999999886',
            conceptId: [],
            echoCollectionId: 'C1972468359-SCIOPS',
            exclude: {},
            openSearchOsdd: 'http://47.90.244.40/glass/osdd/fapar_modis_0.05d.xml',
            options: {},
            pageNum: 1,
            pageSize: 20,
            sortKey: '-start_date',
            twoDCoordinateSystem: {}
          })

          req.alias = 'granulesRequest'
          req.reply({
            body: opensearchGranulesBody,
            headers: opensearchGranulesHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/search/granules/timeline'
        },
        (req) => {
          expect(req.body).to.eq('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1972468359-SCIOPS')

          req.reply({
            body: opensearchGranulesTimelineBody,
            headers: opensearchGranulesTimelineHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/api'
        },
        (req) => {
          expect(JSON.stringify(req.body)).to.eq(graphQlGetCollection(conceptId))

          req.reply({
            body: opensearchGranulesCollectionGraphQlBody,
            headers: opensearchGranulesCollectionGraphQlHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/autocomplete'
        }, {
          body: { feed: { entry: [] } }
        })

        cy.visit(`search/granules?p=${conceptId}&pg[0][v]=f&pg[0][gsk]=-start_date&q=${conceptId}&polygon[0]=42.1875,-2.40647,42.1875,-9.43582,49.21875,-9.43582,42.1875,-2.40647&tl=1622520000!3!!`)

        aliases.forEach((alias) => {
          cy.wait(`@${alias}`)
        })
        cy.wait('@granulesRequest')
      })

      it('displays an outline of the minimum bounding rectangle', () => {
        cy.get('.leaflet-interactive').first().should('have.attr', 'd', 'M1000 434L1000 484L1050 484L1000 434z')
        cy.get('.leaflet-interactive').last().should('have.attr', 'd', 'M1000 484L1000 434L1050 434L1050 484L1000 484z')
      })

      it('displays a hint about using a bounding box instead of polygon', () => {
        getByTestId('filter-stack__spatial').get('.filter-stack-item__error').should('have.text', 'This collection does not support polygon search. Your polygon has been converted to a bounding box.')
      })
    })
  })
})
