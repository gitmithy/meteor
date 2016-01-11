AccountsUIWrapper = React.createClass({
    componentDidMount() {
        // 使用 Meteor Blaze 渲染登录按钮
        this.view = Blaze.render(Template.loginButtons,
            React.findDOMNode(this.refs.container));
    },
    componentWillUnmount() {
        // 删除 Blaze view
        Blaze.remove(this.view);
    },
    render() {
        // 渲染一个用于填充登录按钮的span
        return <span ref="container" />;
    }
});