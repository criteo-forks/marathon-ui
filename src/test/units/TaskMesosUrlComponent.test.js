import {expect} from "chai";
import {shallow} from "enzyme";
import nock from "nock";

import React from "react/addons";
import InfoActions from "../../js/actions/InfoActions";
import InfoEvents from "../../js/events/InfoEvents";
import InfoStore from "../../js/stores/InfoStore";
import TaskMesosUrlComponent from "../../js/components/TaskMesosUrlComponent";

import config from "../../js/config/config";

describe("TaskMesosUrlComponent", function () {

  before(function (done) {
    this.model = {
      appId: "/app-1",
      id: "task-123",
      slaveId: "20150720-125149-3839899402-5050-16758-S1"
    };

    var info = {
      version: "1.2.3",
      frameworkId: "framework1",
      leader: "leader1.dcos.io",
      "marathon_config": {
        "marathon_field_1": "mf1",
        "mesos_leader_ui_url": "http://leader1.dcos.io:5050/"
      }
    };

    nock(config.apiURL)
      .get("/v2/info")
      .reply(200, info);

    InfoStore.once(InfoEvents.CHANGE, () => {
      this.component = shallow(<TaskMesosUrlComponent task={this.model}/>);
      done();
    });
    InfoActions.requestInfo();
  });

  after(function () {
    this.component.instance().componentWillUnmount();
  });

  it("has the correct mesos task url", function () {
    var url = this.component.props().href;
    expect(url).to.equal(
      "http://leader1.dcos.io:5050/#/agents/20150720-125149-3839899402-5050-" +
      "16758-S1/frameworks/framework1/executors/task-123/tasks/task-123/browse"
    );
  });

  it("has the correct mesos task url when mesosUrl has trailing slash",
    function () {
      this.component.setProps({task: this.model});

      var url = this.component.props().href;
      expect(url).to.equal(
        "http://leader1.dcos.io:5050/#/agents/20150720-125149-3839899402-" +
        "5050-16758-S1/frameworks/framework1/executors/task-123/" +
        "tasks/task-123/browse"
      );
    });

    it("has the correct mesos task url when using custom executor",
      function () {

        var taskWithExecutor = {
          appId: "/app-1",
          id: "task-123",
          executor: "custom",
          slaveId: "20150720-125149-3839899402-5050-16758-S1"
        }

        this.component.setProps({task: taskWithExecutor});

        var url = this.component.props().href;
        expect(url).to.equal(
          "http://leader1.dcos.io:5050/#/agents/20150720-125149-3839899402-" +
          "5050-16758-S1/frameworks/framework1/executors/marathon-task-123" +
          "/tasks/marathon-task-123/browse"
        );
      });

      it("has the correct mesos task url when using command executor",
        function () {

          var taskWithExecutor = {
            appId: "/app-1",
            id: "task-123",
            executor: "//cmd",
            slaveId: "20150720-125149-3839899402-5050-16758-S1"
          }

          this.component.setProps({task: taskWithExecutor});

          var url = this.component.props().href;
          expect(url).to.equal(
            "http://leader1.dcos.io:5050/#/agents/20150720-125149-3839899402-" +
            "5050-16758-S1/frameworks/framework1/executors/task-123" +
            "/tasks/task-123/browse"
          );
        });
});
