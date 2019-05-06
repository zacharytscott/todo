import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";
import App from "./App";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("App.js ", () => {
  it("renders a todo when it is fetched successfully", () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: [
          {
            _id: "5ccf8a04ed291320f4ae8768",
            text: "My new task",
            completed: false,
            __v: 0
          }
        ]
      });
    });

    const wrapper = mount(<App />);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.exists(".text")).toBe(true);
    });
  });

  it("displays an error message when failing to fetch todos", () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.reject(new Error("There was an error!"));
    });

    const wrapper = mount(<App />);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.exists(".server-error")).toBe(true);
    });
  });
});
