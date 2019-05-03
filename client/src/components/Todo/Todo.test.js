import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import Todo from "./Todo";

configure({ adapter: new Adapter() });

describe("Todo Component", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(
      <Todo
        key="dummy key"
        active={false}
        text="This is some dummy task text"
        toggleTaskHandler={() => {}}
        deleteTaskHandler={() => {}}
        item={{
          text: "A new mock task",
          completed: true
        }}
      />
    );
  });

  it("should render a checkbox with the completed class if the task is completed", () => {
    expect(
      wrapper
        .find('button.checkbox[title="Mark this task as incomplete"]')
        .hasClass("completed")
    ).toBe(true);
  });

  it("should render a checkbox without the completed class if the task is not completed", () => {
    wrapper.setProps({
      active: true
    });

    expect(
      wrapper
        .find('button.checkbox[title="Mark this task as completed"]')
        .hasClass("completed")
    ).toBe(false);
  });
});
