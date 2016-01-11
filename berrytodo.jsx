Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // 这里的代码只会在客户端（即浏览器）运行
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.subscribe("tasks");


    Meteor.startup(function () {
        // 使用Meteor.startup可以保证页面加载好了再渲染组件
        // 在 React 0.14 中，原来的 react package 被拆分为
        // react 和 react-dom
        // 而 react-dom 包含 ReactDOM.render、.unmountComponentAtNode、.findDOMNode
        // 所以这里使用 ReactDOM.render 而不再是 React.render
        React.render(<App />, document.getElementById("render-target"));
    });
}

if (Meteor.isServer) {
    // 只发布公开的和用户自己的私有的task
    Meteor.publish("tasks", function () {
        return Tasks.find({
            $or: [
                { private: {$ne: true} },
                { owner: this.userId }
            ]
        });
    });
}

Meteor.methods({
    // 添加 tas
    addTask(text) {
        // 只有登录后才能添加task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Tasks.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    // 删除 task
    removeTask(taskId) {
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // 如果task是私有的，则只有作者能删除
            throw new Meteor.Error("not-authorized");
        }

        Tasks.remove(taskId);
    },

    // 修改 task 状态
    setChecked(taskId, setChecked) {
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // 如果task是私有的，则只有作者能修改其状态
            throw new Meteor.Error("not-authorized");
        }
        Tasks.update(taskId, { $set: { checked: setChecked} });
    },
    // 设置私有 task
    setPrivate(taskId, setToPrivate) {
        const task = Tasks.findOne(taskId);

        // 用户只能把自己的task设置为私有
        if (task.owner !== Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    }

});