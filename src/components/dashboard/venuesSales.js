import React, {Component} from 'react'
import '../../css/dashboard.css';
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
const options2 = { style: 'currency', currency: 'PEN' };
const numberFormat = new Intl.NumberFormat('en-US', options2);
const numberFormat2 = new Intl.NumberFormat('en-US');
library.add(fas)
const compare_sales = (a, b) => {
  if (a.amount > b.amount) return -1;
  if (b.amount > a.amount) return 1;

  return 0;
}
class VenuesSales extends Component {
  state = {
    sales_data: [],
    loaded: false,
  }
  componentDidMount() {
    axios.get('http://localhost:4000/dashboard/bestsellers')
      .then(res => {
        let venues_historic = [];
        let venues_lmonth = [];
        let tenant_historic = [];
        let tenant_lmonth = [];
        res.data.venues_sales.forEach((venue) => {
          venues_historic.push({
            name_venue: venue.name_venue,
            id: venue.id,
            amount: venue.historic.amount,
            transactions : venue.historic.transactions
          });
          venues_lmonth.push({
            name_venue: venue.name_venue,
            id: venue.id,
            amount: venue.last_month.amount,
            transactions : venue.last_month.transactions
          });
        });
        res.data.tenant_sales.forEach((tenant) => {
          tenant_historic.push({
            id: tenant.tenant_id,
            amount: tenant.historic.amount,
            transactions : tenant.historic.transactions
          });
          tenant_lmonth.push({
            id: tenant.tenant_id,
            amount: tenant.last_month.amount,
            transactions : tenant.last_month.transactions
          });
        });
        this.setState({
          sales_data : {
            venues_historic : venues_historic,
            venues_lmonth : venues_lmonth,
            tenant_historic : tenant_historic.sort(compare_sales),
            tenant_lmonth : tenant_lmonth.sort(compare_sales),
          },
          loaded: true
        });
      });
  }
  render () {
    return (
      <div>
      <Card className="card-margin">
        <Card.Header>
        <Card.Title>Top venues sales</Card.Title>
        </Card.Header>
        <Card.Body>
          { this.state.loaded ? (
            <div className="row">
              <div className="col-md-6">
              <Card>
                <Card.Header className="dashboard-row">
                This month
                </Card.Header>
                <Card.Body className="internal-card">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th className="text-right">Transactions</th>
                        <th className="text-right">Total Sales (S/.)</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.sales_data.venues_historic.map((venue, i) => {
                       return (
                         <tr>
                           <td>{venue.id}</td>
                           <td>{venue.name_venue}</td>
                           <td className="text-right">{numberFormat2.format(venue.transactions)}</td>
                           <td className="text-right">{numberFormat.format(venue.amount)}</td>
                         </tr>
                       )
                    })}
                    </tbody>
                    </Table>
                </Card.Body>
              </Card>
              </div>
              <div className="col-md-6">
                <Card>
                  <Card.Header className="dashboard-row">
                  Last month
                  </Card.Header>
                  <Card.Body className="internal-card">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th className="text-right">Transactions</th>
                        <th className="text-right">Total Sales (S/.)</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.sales_data.venues_lmonth.map((venue, i) => {
                       return (
                         <tr>
                           <td>{venue.id}</td>
                           <td>{venue.name_venue}</td>
                           <td className="text-right">{numberFormat2.format(venue.transactions)}</td>
                           <td className="text-right">{numberFormat.format(venue.amount)}</td>
                         </tr>
                       )
                    })}
                    </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </div>
            </div>
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
      <Card className="card-margin">
        <Card.Header>
        <Card.Title>Top 10 Vendors (tenant) sales</Card.Title>
        </Card.Header>
        <Card.Body>
          { this.state.loaded ? (
            <div className="row">
              <div className="col-md-6">
              <Card>
                <Card.Header className="dashboard-row">
                This month
                </Card.Header>
                <Card.Body className="internal-card">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th className="text-right">Transactions</th>
                        <th className="text-right">Total Sales (S/.)</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.sales_data.tenant_historic.map((venue, i) => {
                      if(i > 10){
                        return;
                      }
                       return (
                         <tr>
                           <td>{venue.id}</td>
                           <td className="text-right">{numberFormat2.format(venue.transactions)}</td>
                           <td className="text-right">{numberFormat.format(venue.amount)}</td>
                         </tr>
                       )
                    })}
                    </tbody>
                    </Table>
                </Card.Body>
              </Card>
              </div>
              <div className="col-md-6">
                <Card>
                  <Card.Header className="dashboard-row">
                  Last month
                  </Card.Header>
                  <Card.Body className="internal-card">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th className="text-right">Transactions</th>
                        <th className="text-right">Total Sales (S/.)</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.sales_data.tenant_lmonth.map((venue, i) => {
                        if(i > 10){
                          return;
                        }
                       return (
                         <tr>
                           <td>{venue.id}</td>
                           <td className="text-right">{numberFormat2.format(venue.transactions)}</td>
                           <td className="text-right">{numberFormat.format(venue.amount)}</td>
                         </tr>
                       )
                    })}
                    </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </div>
            </div>
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
      </div>
    )
  }
}
export default VenuesSales
