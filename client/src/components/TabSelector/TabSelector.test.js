import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import TabSelector from "./TabSelector";

configure({ adapter: new Adapter() });

describe("TabSelector Component", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(
      <TabSelector
        selectedTab="all"
        selectAllTabHandler={() => {}}
        selectActiveTabHandler={() => {}}
        selectCompletedTabHandler={() => {}}
        activeCount={0}
      />
    );
  });

  it("Renders without a count of active items if there are none given", () => {
    expect(wrapper.find("span").length).toBe(0);
  });

  it("Renders with a count of active items if some are given", () => {
    wrapper.setProps({
      activeCount: 3
    });

    expect(wrapper.find("span").text()).toBe("(3)");
  });

  it("Adds the active class to the selected tab", () => {
    expect(
      wrapper
        .find("button")
        .first()
        .hasClass("active")
    ).toBe(true);

    wrapper.setProps({
      selectedTab: "active"
    });

    expect(
      wrapper
        .find("button")
        .at(1)
        .hasClass("active")
    ).toBe(true);

    wrapper.setProps({
      selectedTab: "completed"
    });

    expect(
      wrapper
        .find("button")
        .at(2)
        .hasClass("active")
    ).toBe(true);
  });
});
