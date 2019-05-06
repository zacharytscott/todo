import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";
import App from "./App";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("App.js ", () => {
  it("renders without crashing", () => {
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

    shallow(<App />);
  });
});
