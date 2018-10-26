import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectModule } from 'redux-modules';
import { withRouter } from 'react-router';
import { compose } from 'ramda';
import { Input, Button } from '@procore/core-react';

import searchModule from '../../module';

const { actions, selector } = searchModule;

export class SearchBar extends Component {
  static get propTypes() {
    return {
      actions: PropTypes.shape({
        doSearch: PropTypes.func,
      }),
      history: PropTypes.shape({
        push: PropTypes.func,
      }),
      searchTerm: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      actions: { doSearch() {} },
      history: { push() {} },
      searchTerm: '',
    };
  }

  constructor(props) {
    super(props);

    this.doSearch = this.doSearch.bind(this);
    this.onSearchTermChanged = this.onSearchTermChanged.bind(this);
    this.onSearchTermKeyUp = this.onSearchTermKeyUp.bind(this);

    this.state = { searchTerm: props.searchTerm || '' };
  }

  doSearch() {
    if (!!this.state.searchTerm) {
      this.props.actions.doSearch(this.state.searchTerm);
      this.props.history.push(`/search/${this.state.searchTerm}`);
    }
  }

  onSearchTermChanged({ target: { value } }) {
    this.setState({ searchTerm: value });
  }

  onSearchTermKeyUp({ key }) {
    if (key === 'Enter') {
      this.doSearch();
    }
  }

  render() {
    return (
      <div>
        <Input
          value={this.state.searchTerm}
          onChange={this.onSearchTermChanged}
          onKeyUp={this.onSearchTermKeyUp}
        />
        <Button variant="secondary" onClick={this.doSearch} />
      </div>
    );
  }
}

export default compose(
  connectModule(searchModule),
  withRouter
)(SearchBar);
