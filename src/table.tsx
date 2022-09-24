import React from "react";
import { Table, Button} from "reactstrap";
export default class myTable extends React.Component {
  state:any = {
    data: this.props.children
  };
  //Lifecycle Mouth
  componentWillReceiveProps(nextProps:any) {
    if (
      nextProps.data &&
      JSON.stringify(this.props.children) !== JSON.stringify(nextProps.data)
    ) {
      this.setState({
        data: nextProps.data
      });
    }
  }
  render() {
    return (
      <>
      <Table bordered>
        <thead>
          <tr>
          <th>Stt</th>
            <th>Source</th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((item:any) => {
            return (
              <tr key={item.source}>
                <td>
                  #
                </td>
                <td>
                  {item.source}
                </td>
                <td>
                  {item.translated}
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
