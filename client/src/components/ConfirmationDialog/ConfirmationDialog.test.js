import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import ConfirmationDialog from "./ConfirmationDialog";

configure({ adapter: new Adapter() });

describe("ConfirmationDialog Component", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(
      <ConfirmationDialog
        visible
        yesClickHandler={() => {}}
        cancelClickHandler={() => {}}
      />
    );
  });

  it("renders with an active class if visible is set to true", () => {
    expect(wrapper.exists(".active")).toBe(true);
  });

  it("renders without an active class if visible is set to false", () => {
    wrapper.setProps({
      visible: false
    });

    expect(wrapper.exists(".active")).toBe(false);
  });
});
