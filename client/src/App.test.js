import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";
import App from "./App";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("App.js ", () => {
  it("renders without crashing when successfully fetching todos", () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: false,
          __v: 0
        }
      ]
    });

    mount(<App />);
  });

  it("renders without crashing when successfully fetching todos", () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.reject(new Error("There was an error!"));
    });

    const wrapper = mount(<App />);
    expect(wrapper.state("errorFetchingTodos")).toBe(true);
    expect(wrapper.exists(".server-error")).toBe(true);
    //console.log(wrapper.debug());
  });
});
