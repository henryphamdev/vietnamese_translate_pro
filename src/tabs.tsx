import React from "react";
import Translate from "./table";
import Reminder from "./table_reminder";

let getTranslateHistory = async () => {
  return new Promise((resolve: any, reject: any) => {
    chrome.storage.sync.get(
      {
        translated_history: [],
      },
      function (data) {
        resolve(data.translated_history);
        localStorage.setItem(
          "translated_history",
          JSON.stringify(data.translated_history)
        );
      }
    );
    chrome.storage.sync.get(
      {
        reminder: [],
      },
      function (data) {
        resolve(data.reminder);
        localStorage.setItem("reminder", JSON.stringify(data.reminder));
      }
    );
  });
};

const PopupTranslate = () => {
  getTranslateHistory();
  let dataRender: any = localStorage.getItem("translated_history");
  try {
    dataRender = JSON.parse(dataRender);
  } catch {
    console.log("Cannot parse translated history to json!");
  }
  return <Translate children={dataRender} />;
};

const PopupReminder = () => {
  getTranslateHistory();
  let dataRender: any = localStorage.getItem("reminder");
  console.dir(dataRender, { depth: null });
  console.log("ahihi");
  try {
    dataRender = JSON.parse(dataRender);
  } catch {
    console.log("Cannot parse translated history to json!");
  }
  return <Reminder children={dataRender} />;
};

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
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
        activeTab: "1",
      });
    }
  }

  toggle(tab: any) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    return (
      <>
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <strong>Translated Words</strong>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <strong>Reminding Qoutes</strong>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab || "1"}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <Col>
                    <PopupTranslate />
                  </Col>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="6">
                  <Col>
                    <PopupReminder />
                  </Col>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </>
    );
  }
}
