import React, {Component} from 'react'
import '../css/dashboard.css';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Collapse from 'react-bootstrap/Collapse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
library.add(fas)
class Marketing extends Component {
  state = {
    send_present: false,
    venues:[],
    venue_selected : '*',
    gender_selected: '*',
    loaded: false,
  }
  constructor() {
    super();
    this.onChangePresent = this.onChangePresent.bind(this);
  }
  componentDidMount() {
    axios.get('http://149.56.94.138:4000/dashboard/marketingscreen')
      .then(res => {
        this.setState({
          venues: res.data.venues,
          send_present: res.data.send_present,
          venue_selected : res.data.venue_selected,
          gender_selected: res.data.gender_selected,
          loaded: true,
        });
      });
  }
  render () {
    return (
      <Card className="card-margin">
        <Card.Header>
        <Card.Title>Birthday gift</Card.Title>
        </Card.Header>
        <Card.Body>
          <h3>Send email gift to Customers on their birthdays</h3>
          { this.state.loaded ? (
            <form>
                <div>
                  <Form.Check
                    checked={this.state.send_present}
                    type='checkbox'
                    id="send_birth"
                    onChange={this.onChangePresent}
                    inline label="Send Birthday present"/>
                </div>
                <Collapse in={this.state.send_present}>
                  <div id="example-collapse-text" className="row">
                  <div className="col-md-6">
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Customer from</Form.Label>
                    <Form.Control as="select" defaultValue={this.state.venue_selected}>
                      <option value="*">All venues</option>
                      {this.state.venues.map((ven, i) => {
                         return (
                           <option value={ven.id}>{ven.name}</option>
                         )
                      })}
                    </Form.Control>
                  </Form.Group>
                  </div>
                  <div className="col-md-6">
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Customer gender</Form.Label>
                    <Form.Control as="select" defaultValue={this.state.gender_selected}>
                      <option value="*" >Any</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Control>
                  </Form.Group>
                  </div>
                  </div>

                </Collapse>
                <div class="row">
                  <div className="col-md-12 text-center"><span className="btn btn-primary">Save</span></div>
                </div>
            </form>
            ) : (
              <div className="row">
                <div className="col-md-12 dashboard-row">
                  <FontAwesomeIcon icon="spinner" className="blue-spinner" spin  size="3x"/>
                </div>
              </div>
            )
          }

        </Card.Body>
      </Card>
    )
  }
  onChangePresent(e){
    this.setState({ send_present: e.target.checked });
  }
}
export default Marketing
