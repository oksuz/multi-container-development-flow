import React from "react";
import axios from "axios";

export default class App extends React.Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  fetchValues() {
    axios.get("/api/values/current").then(({ data }) => {
      this.setState({ values: data });
    });
  }

  fetchIndexes() {
    axios.get("/api/values/all").then(({ data }) => {
        this.setState({ seenIndexes: data });
      });
  }

  renderSeenIndexes() {
    return this.state.seenIndexes
      .map((d) => {
        return d.number;
      })
      .join(", ");
  }

  handleSubmit = (event) => {
    event.preventDefault();

    axios.post('/api/values', { index: this.state.index }).then(() => {
      this.setState({ index: '' });
    });
  }

  renderCalculated() {
    const items = Object.keys(this.state.values).map((k) => {
      const calcualted = this.state.values[k];
      return (
        <li key={k}>
          For Index {k} calculated value is {calcualted}
        </li>
      );
    });

    return React.createElement("ul", null, ...items);
  }

  render() {
    return (
      <div style={{ textAlign: "center", margin:50 }}>
        <h1>Fib Calculator</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Index: </label>
          <input
            value={this.state.index}
            onChange={(e) => {
              this.setState({ index: e.target.value });
            }}
          />
          <button type="submit">Submit</button>
        </form>
        <h3>Indexes I have seen</h3>
        {this.renderSeenIndexes()}
        <h3>Calcualted</h3>
        {this.renderCalculated()}
      </div>
    );
  }
}
