import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";
import App from "./App";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("App.js ", () => {
  let wrapper = null;

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: false,
          __v: 0
        }
      ]
    });

    wrapper = mount(<App />);
  });

  it("renders without crashing", () => {
    console.log(wrapper.debug());
    expect(wrapper.exists(".text")).toBe(true);
    expect(wrapper.state("selectedTab")).toBe("all");
  });
});
