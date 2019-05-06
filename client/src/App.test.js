import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";
import App from "./App";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("App.js ", () => {
  beforeAll(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  test("app.updateLists() sets state properly", () => {
    const testCases = [
      [
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: false,
          __v: 0
        },
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My completed task",
          completed: true,
          __v: 0
        }
      ],
      [
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: false,
          __v: 0
        }
      ],
      []
    ];

    const wrapper = shallow(<App />);

    testCases.forEach(testCase => {
      wrapper.instance().updateLists(testCase);

      const activeList = testCase.filter(item => !item.completed);
      const completedList = testCase.filter(item => item.completed);

      expect(wrapper.state("todoList")).toBe(testCase);
      expect(wrapper.state("activeList")).toEqual(activeList);
      expect(wrapper.state("activeCount")).toBe(activeList.length);
      expect(wrapper.state("completedList")).toEqual(completedList);
      expect(wrapper.state("completedCount")).toBe(completedList.length);
    });
  });

  test("app.toggleTaskSuccessHandler sets state properly", () => {
    const testCases = [
      {
        data: {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: true,
          __v: 0
        }
      }
    ];

    const wrapper = shallow(<App />);

    testCases.forEach(testCase => {
      wrapper.setState({
        todoList: [
          {
            _id: "5ccf8a04ed291320f4ae8768",
            text: "My new task",
            completed: false,
            __v: 0
          },
          {
            _id: "Some other ID",
            text: "A different task",
            completed: false,
            __v: 0
          }
        ]
      });

      const updatedList = wrapper.instance().toggleTaskSuccessHandler(testCase);

      expect(
        updatedList.filter(item => item._id === testCase.data._id)
      ).toEqual([testCase.data]);
    });
  });

  test("app.todosFetchSuccessHandler sets state properly", () => {
    const testCase = {
      data: [
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: true,
          __v: 0
        }
      ]
    };

    const wrapper = shallow(<App />);

    wrapper.instance().todosFetchSuccessHandler(testCase);
    expect(wrapper.state("errorFetchingTodos")).toBeFalsy();
  });

  test("app.todosFetchErrorHandler sets state properly", () => {
    const testCase = {
      data: [
        {
          _id: "5ccf8a04ed291320f4ae8768",
          text: "My new task",
          completed: true,
          __v: 0
        }
      ]
    };

    const wrapper = shallow(<App />);

    wrapper.instance().todosFetchErrorHandler(testCase);
    expect(wrapper.state("errorFetchingTodos")).toBeTruthy();
  });

  test("app.toggleTaskHandler calls the proper function when successful", () => {
    const testCase = {
      _id: "5ccf8a04ed291320f4ae8768",
      text: "My new task",
      completed: true,
      __v: 0
    };

    axios.put.mockResolvedValue(testCase);

    const wrapper = shallow(<App />);
    const mockToggleTaskSuccessHandler = jest.fn();

    wrapper.instance().toggleTaskSuccessHandler = mockToggleTaskSuccessHandler;
    wrapper.update();
    wrapper
      .instance()
      .toggleTaskHandler(testCase)
      .then(() => {
        expect(mockToggleTaskSuccessHandler).toBeCalledWith(testCase);
      });
  });

  test("app.toggleTaskHandler calls the proper function when it fails", () => {
    const testCase = {
      _id: "5ccf8a04ed291320f4ae8768",
      text: "My new task",
      completed: true,
      __v: 0
    };

    axios.put.mockRejectedValue(testCase);

    const wrapper = shallow(<App />);
    const mockdisplayErrorToast = jest.fn();

    wrapper.instance().displayErrorToast = mockdisplayErrorToast;
    wrapper.update();
    wrapper
      .instance()
      .toggleTaskHandler(testCase)
      .then(() => {
        expect(mockdisplayErrorToast).toHaveBeenCalledTimes(1);
      });
  });
});
