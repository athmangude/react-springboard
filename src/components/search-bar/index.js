/* eslint-disable no-nested-ternary */

import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Spinner from "react-spinner-material";

const SearchBarWrapper = styled.div``;

export default class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    itemOnClickAction: PropTypes.func.isRequired,
    itemDisplayProp: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.onCancelSearch = this.onCancelSearch.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onViewAccount = this.onViewAccount.bind(this);
  }

  state = {
    isSearching: false,
    results: null,
    searchTerm: "",
    selected: false
  };

  onCancelSearch() {
    this.setState({
      results: null,
      searchTerm: "",
      isSearching: false,
      selected: false
    });
  }

  async onSearch(event) {
    const searchTerm = event.target.value;

    this.setState({ searchTerm }, async () => {
      if (searchTerm.length) {
        this.setState({ isSearching: true });
        try {
          const searchActionResult = await this.props.searchAction(
            this.state.searchTerm
          );

          if (this.props.dataProp) {
            this.setState({
              results: searchActionResult.data.Data[this.props.dataProp]
            });
          } else {
            this.setState({ results: searchActionResult.data.Data });
          }
        } catch (exception) {
          // TODO: handle the exception
          this.setState({ results: null });
        } finally {
          this.setState({ isSearching: false });
        }
      }
    });
  }

  onViewAccount(accountId) {
    this.setState(
      {
        isSearching: false,
        results: null,
        searchTerm: ""
      },
      () => {
        this.context.router.history.replace(`/accounts/${accountId}`);
      }
    );
  }

  itemOnClickAction(result) {
    const { itemOnClickAction, itemDisplayProp } = this.props;
    this.setState(
      { searchTerm: result[itemDisplayProp], results: null, selected: true },
      () => itemOnClickAction(result)
    );
  }

  render() {
    const showMatches = this.state.results && this.state.results.length;

    return (
      <SearchBarWrapper>
        <div style={{ width: "100%", display: "flex" }}>
          <input
            type="text"
            value={this.state.searchTerm}
            placeholder={this.props.placeholder}
            style={{
              width: "100%",
              height: 50,
              backgroundColor: "#e8eaed",
              borderRadius:
                showMatches ||
                (this.state.searchTerm.length && !this.state.isSearching)
                  ? 0
                  : 25,
              outline: "none",
              padding: "0 50px 0 20px",
              fontSize: 21
            }}
            onChange={this.onSearch}
          />
          {this.state.isSearching ? (
            <div
              style={{
                position: "absolute",
                top: 10,
                bottom: 0,
                right: 10
              }}
            >
              <Spinner spinnerColor="#808285" size={30} spinnerWidth={3} />
            </div>
          ) : this.state.searchTerm.length ? (
            <div
              role="button"
              onClick={this.onCancelSearch}
              style={{
                position: "absolute",
                top: 5,
                bottom: 0,
                right: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <i
                className="material-icons"
                style={{ color: "#808285", fontSize: 40, cursor: "pointer" }}
              >
                cancel
              </i>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: 5,
                bottom: 0,
                right: 5
              }}
            >
              <i
                className="material-icons"
                style={{ color: "#d9d9d9", fontSize: 40 }}
              >
                search
              </i>
            </div>
          )}
        </div>
        {showMatches ? (
          <div
            className="search-results"
            style={{
              width: "100%",
              maxHeight: 200,
              overflowY: "auto",
              position: "absolute",
              top: 50,
              backgroundColor: "#fff",
              overflow: "auto",
              boxShadow: "0 5px 10px rgba(0 , 0, 0, 0.3)",
              borderBottomRightRadius: 3,
              borderBottomLeftRadius: 3
            }}
          >
            {this.state.results.map(result => (
              <div
                role="button"
                className="search-results-item"
                style={{ width: "100%", padding: 10 }}
                onClick={() => this.itemOnClickAction(result)}
              >
                <span>{result[this.props.itemDisplayProp]}</span>
              </div>
            ))}
          </div>
        ) : this.state.searchTerm.length &&
          !this.state.isSearching &&
          !this.state.selected ? (
          <div
            className="search-results"
            style={{
              width: "100%",
              maxHeight: 200,
              overflowY: "auto",
              position: "absolute",
              top: 50,
              padding: "20px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              overflow: "auto",
              boxShadow: "0 5px 10px rgba(0 , 0, 0, 0.3)",
              borderBottomRightRadius: 3,
              borderBottomLeftRadius: 3
            }}
          >
            <span>No results found</span>
          </div>
        ) : null}
      </SearchBarWrapper>
    );
  }
}
