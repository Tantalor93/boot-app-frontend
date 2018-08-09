import React, {Component} from 'react';
import {Button, ButtonToolbar, Table} from 'react-bootstrap';


class App extends Component {

    static FIRST_PAGE = "http://localhost:8080/feedbacks?size=10";

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            feedbacks: [],
            next: null
        };
    }

    componentDidMount() {
        this.fetchFeedbacks(App.FIRST_PAGE);
    }

    fetchFeedbacks(url) {
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                    this.setState({
                        isLoaded: true,
                        feedbacks: result,
                        next: result._links.next
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            );
    }

    onClick(next) {
        this.setState({isLoaded: false});
        this.fetchFeedbacks(next);
    }

    render() {
        const {error, isLoaded, feedbacks, next} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else if (!isLoaded) {
            return <div>Loading...</div>
        } else {

            return (
                <div>

                    <Table striped={true} bordered={true} responsive={true}>
                        <thead>
                        <tr>
                            <th>name</th>
                            <th>email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {feedbacks._embedded.map(
                            (item) => {
                                const feedback = item.feedback;
                                return <tr key={feedback.id}>

                                    <td>{feedback.name}</td>
                                    <td>{feedback.email}</td>
                                </tr>
                            }
                        )
                        }
                        </tbody>
                    </Table>

                    <div>
                        <ButtonToolbar>
                            <Button
                                onClick={() => this.onClick(App.FIRST_PAGE)}
                            >
                                First
                            </Button>
                            <Button disabled={next == null}
                                    onClick={() => this.onClick(this.state.next.href)}
                            >
                                Next
                            </Button>
                        </ButtonToolbar>

                    </div>
                </div>
            );
        }
    }
}

export default App;
