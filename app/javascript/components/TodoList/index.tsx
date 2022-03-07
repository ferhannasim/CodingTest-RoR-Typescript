import React, {useState, useEffect } from "react";
import { Container, ListGroup, Form } from "react-bootstrap";
import { ResetButton } from "./uiComponent";
import axios from "axios";
import { createFalse } from "typescript";

type TodoItem = {
  id: number;
  title: string;
  checked: boolean;
};

type Props = {
  todoItems: TodoItem[];
};

const TodoList: React.FC<Props> = ({ todoItems }) => {

  // todoItems list state
  const [checkBoxState,setCheckBoxState] = useState(todoItems);

  useEffect(() => {
    const token = document.querySelector(
      "[name=csrf-token]"
    ) as HTMLMetaElement;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
  }, []);

  const checkBoxOnCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number,
    itemIndex: number
  ): void => {

    //checkbox state handling ----start
    let newStates = checkBoxState.map((curr,index) =>{
        return index === itemIndex ? {...curr, checked: !(curr.checked)} : curr
    })
    setCheckBoxState(newStates);
    //checkbox state handling ----end

    axios.post("/todo", {
      id: todoItemId,
      checked: e.target.checked,
    });
  };

  const resetButtonOnClick = (): void => {

    //reseting all checkboxes---start
    let newState = checkBoxState.map(curr =>{
        return {...curr, checked: false}
    })
    setCheckBoxState(newState);
    // reseting all checboxes----end

    axios.post("/reset")
    .catch(err =>{
      console.log("Oops something went wrong with server !!", err)
    });
  };


  return (
    <Container>
      <h3>2022 Wish List</h3>
      <ListGroup>
        {todoItems.map((todo,index) => (
          <ListGroup.Item key={todo.id}>
            <Form.Check
              type="checkbox"
              label={todo.title}
              onChange={(e) => checkBoxOnCheck(e, todo.id,index)}
              checked = {checkBoxState[index].checked}
            />
          </ListGroup.Item>
        ))}
        <ResetButton onClick={resetButtonOnClick}>Reset</ResetButton>
      </ListGroup>
    </Container>
  );
};

export default TodoList;
