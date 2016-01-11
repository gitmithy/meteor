// App组件 - 代表Todo应用
App = React.createClass({
    // 必须引入这个 mixin，getMeteorData 方法才会起作用
    mixins: [ReactMeteorData],

    getInitialState() {
        return {
            hideCompleted: false
        }
    },
    getMeteorData() {
        let query = {};

        if (this.state.hideCompleted) {
            // 查找 checked != false 的 task
            query = {checked: {$ne: true}};
        }

        return {
            tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
            incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
            currentUser: Meteor.user()
        };
    },

    getTasks() {
        return [
            { _id: 1, text: "This is task 1" },
            { _id: 2, text: "This is task 2" },
            { _id: 3, text: "This is task 3" }
        ];
    },


    renderTasks() {
        // 从 this.data.tasks 获取数据
        return this.data.tasks.map((task) => {
            const currentUserId = this.data.currentUser && this.data.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;

            return <Task
                key={task._id}
                task={task}
                showPrivateButton={showPrivateButton} />;
        });
    },


    handleSubmit(event) {
        event.preventDefault();

        // 通过 React ref 获取 input 的值
        var text = React.findDOMNode(this.refs.textInput).value.trim();
        // 调用 addTask 方法来添加 task
        Meteor.call('addTask', text);

        React.findDOMNode(this.refs.textInput).value = "";
        Tasks.insert({
            text: text,
            createdAt: new Date(),
            owner: Meteor.userId(),           // 当前登录用户的 _id
            username: Meteor.user().username  // 当前登录用户的用户名


        });

        // 清空 input
        React.findDOMNode(this.refs.textInput).value = "";
    },

    toggleHideCompleted() {
        this.setState({
            hideCompleted: ! this.state.hideCompleted
        });
    },
    render() {
        return (
            <div className="container">
                <header>
                    <h1>待办项目 ({this.data.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly={true}
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted} />
                    </label>
                    <AccountsUIWrapper />
                    { this.data.currentUser ?
                        <form className="new-task" onSubmit={this.handleSubmit} >
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="点击添加新项目" />
                        </form> : ''
                    }
                </header>


                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
});