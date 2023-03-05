import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";

function CurrentList(props) {
  const renderItems = () => {
    if (props.items.length === 0) {
      return <Col>No items added</Col>;
    }

    return props.items.map((item) => {
      return (
        <Col key={item} xs={4}>
          {item}
        </Col>
      );
    });
  };

  return (
    <div>
      <Row>
        <Col>
          <h2>Grocery List</h2>
        </Col>
      </Row>
      <Row className={"items-con"}>{renderItems()}</Row>
    </div>
  );
}

export default CurrentList;
