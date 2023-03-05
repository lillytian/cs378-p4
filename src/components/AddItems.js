import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";

function AddItems(props) {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Add to grocery list</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter grocery item"
          value={props.value}
          onChange={props.onChange}
        ></Form.Control>
      </Form.Group>

      <Button
        className={"btn-span add-btn-con"}
        variant="success"
        onClick={props.onSubmit}
      >
        Add
      </Button>
    </Form>
  );
}

export default AddItems;
