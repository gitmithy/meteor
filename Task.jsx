// Task组件 - 代表一个todo项
Task = React.createClass({
    propTypes: {
        // 该组件通过React的 prop 获取 task
        // 我们可以用 propTypes 将其声明为必须值
        // 即调用这个组件时，必须传递task值
        task: React.PropTypes.object.isRequired,
        showPrivateButton: React.PropTypes.bool.isRequired
    },

    toggleChecked() {
        Meteor.call("setChecked", this.props.task._id, ! this.props.task.checked);
    },

    deleteThisTask() {
        Meteor.call("removeTask", this.props.task._id);
    },
    togglePrivate() {
        Meteor.call("setPrivate", this.props.task._id, ! this.props.task.private);
    },

    render() {
        // 给标志完成的任务添加一个class：checked
        // 以便于CSS渲染不同的样式
        const taskClassName = (this.props.task.checked ? "checked" : "") + " " +
            (this.props.task.private ? "private" : "");

        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteThisTask}>
                    &times;
                </button>

                <input
                    type="checkbox"
                    readOnly={true}
                    checked={this.props.task.checked}
                    onClick={this.toggleChecked} />

                { this.props.showPrivateButton ? (
                    <button className="toggle-private" onClick={this.togglePrivate}>
                        { this.props.task.private ? "私有" : "公共" }
                    </button>
                ) : ''}
                <span className="text">
                    <strong>{this.props.task.username}</strong>: {this.props.task.text}
                </span>
            </li>
        );
    }
});