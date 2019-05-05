import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import AddTodo from "./AddTodo";

configure({ adapter: new Adapter() });

describe("AddTodo Component", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(
      <AddTodo
        buttonState
        value="This is dummy task text"
        addTaskChangeHandler={() => {}}
        addTaskClickHandler={() => {}}
      />
    );
  });

  it("renders with an active class if visible is set to true", () => {
    expect(wrapper.exists(".active")).toBe(true);
  });

  it("renders without an active class if visible is set to false", () => {
    wrapper.setProps({
      buttonState: false
    });

    expect(wrapper.exists(".active")).toBe(false);
  });
});
