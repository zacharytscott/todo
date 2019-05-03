import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import TodoList from "./TodoList";
import Todo from "../Todo/Todo";

configure({ adapter: new Adapter() });

describe("TodoList Component", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(
      <TodoList
        list={[]}
        active={true} // eslint-disable-line react/jsx-boolean-value
        title="Mock Task Title"
        toggleTaskHandler={() => {}}
        deleteTaskHandler={() => {}}
      />
    );
  });

  it("renders no todos when given an empty todo list", () => {
    expect(wrapper.find(Todo).length).toBe(0);
  });

  it("renders todos when given a todo list", () => {
    const todoList = [
      {
        text: "This is some mock text",
        completed: false
      },
      {
        text: "This is more mock text",
        completed: true
      }
    ];

    wrapper.setProps({
      list: todoList
    });

    expect(wrapper.find(Todo).length).toBe(todoList.length);
  });

  it("renders a section with an active class when the active prop is set to true", () => {
    expect(wrapper.find("section").hasClass("active")).toBe(true);
  });

  it("renders a section with a completed class when the active prop is set to false", () => {
    wrapper.setProps({
      active: false
    });

    expect(wrapper.find("section").hasClass("active")).toBe(false);
  });
});
