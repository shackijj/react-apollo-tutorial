import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList';

import { LINKS_PER_PAGE } from './constants'

const POST_MUTATION = gql`
mutation PostMutation($description: String!, $url: String!) {
  post(
    description: $description,
    url: $url,
  ) {
    id
    createdAt
    url
    description
    postedBy {
      id
      name
    }
    votes {
      id
      user {
        id
      }
    }
  }
}
`

class CreateLink extends Component {

  state = {
    description: '',
    url: ''
  }

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>
          <input
            className='mb2'
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            type='text'
            placeholder='A description for the link'
          />
          <input
            className='mb2'
            value={this.state.url}
            onChange={(e) => this.setState({ url: e.target.value })}
            type='text'
            placeholder='The URL for the link'
          />
        </div>
        <button
          onClick={() => this._createLink()}
        >
          Submit
        </button>
      </div>
    )
  }

  _createLink = async () => {
    const { description, url } = this.state
    await this.props.postMutation({
      variables: {
        description,
        url
      },
      update: (store, { data: { post } }) => {
        const variables = {
          first: LINKS_PER_PAGE,
          skip: 0,
          orderBy: 'createdAt_DESC',
        };

        const data = store.readQuery({
          query: FEED_QUERY,
          variables,
        })
        data.feed.links.splice(0,0,post);
        store.writeQuery({
          query: FEED_QUERY,
          variables,
          data
        })
      }
    })
    this.props.history.push(`/`)
  }

}

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink)
