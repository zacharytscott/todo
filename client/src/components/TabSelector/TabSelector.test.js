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
        selectedTab={this.state.selectedTab}
        selectAllTabHandler={this.selectAllTab}
        selectActiveTabHandler={this.selectActiveTab}
        selectCompletedTabHandler={this.selectCompletedTab}
        activeCount={this.state.activeCount}
      />
    );
  });

  it("Renders without a count of active items if there are none given", () => {
    
  });
});
