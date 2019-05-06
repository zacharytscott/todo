import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios";
import App from "./App";

configure({ adapter: new Adapter() });

jest.mock("axios");

const genericCompletedTask = {
  _id: "5ccf8a04ed291320f4ae8768",
  text: "My new task",
  completed: true,
  __v: 0
};

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
        data: genericCompletedTask
      }
    ];

    const wrapper = shallow(<App />);

    testCases.forEach(testCase => {
      wrapper.setState({
        todoList: [
          genericCompletedTask,
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
      data: [genericCompletedTask]
    };

    const wrapper = shallow(<App />);

    wrapper.instance().todosFetchSuccessHandler(testCase);

    expect(wrapper.state("errorFetchingTodos")).toBeFalsy();
  });

  test("app.todosFetchErrorHandler sets state properly", () => {
    const testCase = {
      data: [genericCompletedTask]
    };

    const wrapper = shallow(<App />);

    wrapper.instance().todosFetchErrorHandler(testCase);

    expect(wrapper.state("errorFetchingTodos")).toBeTruthy();
  });

  test("app.toggleTaskHandler calls the proper function when successful", () => {
    const testCase = genericCompletedTask;

    axios.put.mockResolvedValue(testCase);

    const wrapper = shallow(<App />);
    const mockToggleTaskSuccessHandler = jest.fn();

    wrapper.instance().toggleTaskSuccessHandler = mockToggleTaskSuccessHandler;
    wrapper.update();
    return wrapper
      .instance()
      .toggleTaskHandler(testCase)
      .then(() => {
        expect(mockToggleTaskSuccessHandler).toBeCalledWith(testCase);
      });
  });

  test("app.toggleTaskHandler calls the proper function when it fails", () => {
    const testCase = genericCompletedTask;

    axios.put.mockRejectedValue(testCase);

    const wrapper = shallow(<App />);
    const mockdisplayErrorToast = jest.fn();

    wrapper.instance().displayErrorToast = mockdisplayErrorToast;
    wrapper.update();
    return wrapper
      .instance()
      .toggleTaskHandler(testCase)
      .then(() => {
        expect(mockdisplayErrorToast).toHaveBeenCalledTimes(1);
      });
  });

  test("app.addTaskChangeHandler sets state properly", () => {
    const testCases = [
      {
        target: {
          value: "Mock task text"
        }
      },
      {
        target: {
          value: ""
        }
      }
    ];

    testCases.forEach(testCase => {
      const wrapper = shallow(<App />);

      wrapper.instance().addTaskChangeHandler(testCase);

      expect(wrapper.state("addTaskInputValue")).toBe(testCase.target.value);
      expect(wrapper.state("addTaskButtonActive")).toBe(
        testCase.target.value.length > 0
      );
    });
  });

  test("app.postNewTask calls the proper function when successful", () => {
    const testCase = genericCompletedTask;

    axios.post.mockResolvedValue(testCase);

    const wrapper = shallow(<App />);
    const mockPostNewTaskSuccessHandler = jest.fn();

    wrapper.instance().postNewTaskSuccessHandler = mockPostNewTaskSuccessHandler;
    wrapper.update();
    return wrapper
      .instance()
      .postNewTask()
      .then(() => {
        expect(mockPostNewTaskSuccessHandler).toHaveBeenCalledTimes(1);
      });
  });

  test("app.postNewTask calls the proper function when it fails", () => {
    const testCase = genericCompletedTask;

    axios.post.mockRejectedValue(testCase);

    const wrapper = shallow(<App />);
    const mockdisplayErrorToast = jest.fn();

    wrapper.instance().displayErrorToast = mockdisplayErrorToast;
    wrapper.update();
    return wrapper
      .instance()
      .postNewTask()
      .then(() => {
        expect(mockdisplayErrorToast).toHaveBeenCalledTimes(1);
      });
  });

  test("app.postNewTaskSuccessHandler sets state properly", () => {
    const testCase = {
      data: genericCompletedTask
    };

    const wrapper = shallow(<App />);

    wrapper.instance().postNewTaskSuccessHandler(testCase);

    expect(wrapper.state("todoList")).toEqual([testCase.data]);
    expect(wrapper.state("activeList")).toEqual([testCase.data]);
    expect(wrapper.state("activeCount")).toEqual(1);
    expect(wrapper.state("addTaskButtonActive")).toBeFalsy();
    expect(wrapper.state("addTaskInputValue")).toEqual("");
  });

  test("app.deleteTaskHandler calls the proper function when successful", () => {
    const testCase = genericCompletedTask;

    axios.delete.mockResolvedValue(testCase);

    const wrapper = shallow(<App />);
    const mockDeleteTaskSuccessHandler = jest.fn();

    wrapper.instance().deleteTaskSuccessHandler = mockDeleteTaskSuccessHandler;
    wrapper.update();
    return wrapper
      .instance()
      .deleteTaskHandler(testCase)
      .then(() => {
        expect(mockDeleteTaskSuccessHandler).toHaveBeenCalledTimes(1);
      });
  });

  test("app.deleteTaskHandler calls the proper function when it fails", () => {
    const testCase = genericCompletedTask;

    axios.delete.mockRejectedValue(testCase);

    const wrapper = shallow(<App />);
    const mockDisplayErrorToast = jest.fn();

    wrapper.instance().displayErrorToast = mockDisplayErrorToast;
    wrapper.update();
    return wrapper
      .instance()
      .deleteTaskHandler(testCase)
      .then(() => {
        expect(mockDisplayErrorToast).toHaveBeenCalledTimes(1);
      });
  });

  test("app.deleteTaskSuccessHandler removes the task properly", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      todoList: [
        genericCompletedTask,
        {
          _id: "A different ID",
          text: "My completed task",
          completed: true,
          __v: 0
        }
      ]
    });

    wrapper.instance().deleteTaskSuccessHandler(genericCompletedTask);

    expect(wrapper.state("todoList").length).toEqual(1);
  });

  test("app.deleteAllCompletedTasks calls the proper function when successful", () => {
    axios.delete.mockResolvedValue();

    const wrapper = shallow(<App />);
    const mockDeleteAllCompletedTasksSuccessHandler = jest.fn();

    wrapper.instance().deleteAllCompletedTasksSuccessHandler = mockDeleteAllCompletedTasksSuccessHandler;
    wrapper.update();

    return wrapper
      .instance()
      .deleteAllCompletedTasksHandler()
      .then(() => {
        expect(mockDeleteAllCompletedTasksSuccessHandler).toHaveBeenCalledTimes(
          1
        );
      });
  });

  test("app.deleteAllCompletedTasks calls the proper function when it fails", () => {
    axios.delete.mockRejectedValue();

    const wrapper = shallow(<App />);
    const mockDisplayErrorToast = jest.fn();

    wrapper.instance().displayErrorToast = mockDisplayErrorToast;
    wrapper.update();

    return wrapper
      .instance()
      .deleteAllCompletedTasksHandler()
      .then(() => {
        expect(mockDisplayErrorToast).toHaveBeenCalledTimes(1);
      });
  });

  test("app.deleteAllCompletedTasksSuccessHandler removes all completed tasks properly", () => {
    const wrapper = shallow(<App />);
    const mockTodoList = [
      genericCompletedTask,
      {
        _id: "A different ID",
        text: "Another completed task",
        completed: true,
        __v: 0
      },
      {
        _id: "Another different ID",
        text: "An incomplete task",
        completed: false,
        __v: 0
      }
    ];

    wrapper.setState({
      todoList: mockTodoList
    });

    wrapper
      .instance()
      .deleteAllCompletedTasksSuccessHandler(genericCompletedTask);

    expect(wrapper.state("todoList")).toEqual([mockTodoList[2]]);
  });

  test("app.showClearCompletedConfirmationDialog sets state properly", () => {
    const wrapper = shallow(<App />);
    wrapper.instance().showClearCompletedConfirmationDialog();
    expect(wrapper.state("clearCompletedTaskConfirmationVisible")).toBeTruthy();
  });

  test("app.hideClearCompletedConfirmationDialog sets state properly", () => {
    const wrapper = shallow(<App />);

    wrapper.setState({
      clearCompletedTaskConfirmationVisible: true
    });

    wrapper.instance().hideClearCompletedConfirmationDialog();

    expect(wrapper.state("clearCompletedTaskConfirmationVisible")).toBeFalsy();
  });

  test("app.selectAllTab sets state properly", () => {
    const wrapper = shallow(<App />);

    wrapper.setState({
      selectedTab: "active"
    });

    wrapper.instance().selectAllTab();

    expect(wrapper.state("selectedTab")).toEqual("all");
  });

  test("app.selectActiveTab sets state properly", () => {
    const wrapper = shallow(<App />);

    wrapper.instance().selectActiveTab();

    expect(wrapper.state("selectedTab")).toEqual("active");
  });

  test("app.selectCompletedTab sets state properly", () => {
    const wrapper = shallow(<App />);

    wrapper.instance().selectCompletedTab();

    expect(wrapper.state("selectedTab")).toEqual("completed");
  });
});
