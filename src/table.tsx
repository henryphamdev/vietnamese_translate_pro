import React from "react";
import { Table, Button } from "reactstrap";
export default class myTable extends React.Component {
  state: any = {
    data: this.props.children,
  };
  root: any = this.props.children;
  //Lifecycle Mouth
  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.data &&
      JSON.stringify(this.props.children) !== JSON.stringify(nextProps.data)
    ) {
      this.setState({
        data: nextProps.data,
      });
    }
  }
  searchData(event: any) {
    this.setState({
      data: this.root,
    });
    if (event.target.value) {
      let data: any = this.root.filter((item: any) => {
        return (
          item.source
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) !== -1
        );
      });
      this.setState({
        data: data,
      });
    }
  }
  removeItem(source: string) {
    let dataRemoved: any = this.root.filter((item: any) => {
      return item.source.toLowerCase().indexOf(source.toLowerCase()) == -1;
    });
    localStorage.setItem("translated_history", JSON.stringify(dataRemoved));
    chrome.storage.local.set(
      {
        translated_history: dataRemoved,
      },
      function () {
        console.log(`${new Date().toISOString()} Remove word success!`);
      }
    );
    this.setState({
      data: dataRemoved,
    });
  }

  maskAsTechWord(source: string) {
    let dataMasked: any = this.root.map((item: any) => {
      if (item.source == source) {
        item.tag = "Tech";
      }
      return item;
    });
    localStorage.setItem("translated_history", JSON.stringify(dataMasked));
    chrome.storage.local.set(
      {
        translated_history: dataMasked,
      },
      function () {
        console.log(`${new Date().toISOString()} Remove word success!`);
      }
    );
    this.setState({
      data: dataMasked,
    });
  }
  render() {
    return (
      <>
        <form>
          <label>
            Search:
            <input
              placeholder="...Translated words"
              type="text"
              autoFocus={true}
              onChange={this.searchData.bind(this)}
            />
          </label>
        </form>
        <Table hover>
          <thead>
            <tr>
              <th>Stt</th>
              <th>Tag</th>
              <th>Source</th>
              <th>Google Translated</th>
              <th>Refe to Cambridge</th>
              <th>Image description</th>
              <th>Action</th>
              <th>Mask As</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((item: any, index: Number) => {
              return (
                <tr key={item.source}>
                  <th scope="row">{index}</th>
                  <td style={{ color: "green" }}>{item.tag || "Normal"}</td>
                  <td>{item.source}</td>
                  <td>{item.translated}</td>
                  <td>
                    <a
                      target="_blank"
                      href={`https://dictionary.cambridge.org/dictionary/english/${item.source}`}
                    >
                      {item.source}
                    </a>
                  </td>
                  <td>
                    <a
                      target="_blank"
                      href={`https://www.google.com/search?q=${item.source}&tbm=isch`}
                    >
                      {item.source}
                    </a>
                  </td>
                  <td>
                    <button
                      style={{ color: "red" }}
                      onClick={(e) => this.removeItem(item.source)}
                    >
                      x
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ color: "green" }}
                      onClick={(e) => this.maskAsTechWord(item.source)}
                    >
                      Tech
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
}
