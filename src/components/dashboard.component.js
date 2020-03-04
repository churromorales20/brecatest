import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import '../css/dashboard.css';
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import VenuesSales from './dashboard/venuesSales'
const options2 = { style: 'currency', currency: 'PEN' };
const numberFormat = new Intl.NumberFormat('en-US', options2);
const numberFormat2 = new Intl.NumberFormat('en-US');
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
//

const compare_social = (a, b) => {
  if (a.likes > b.likes) return -1;
  if (b.likes > a.likes) return 1;

  return 0;
}
const compare_visits = (a, b) => {
  if (a.visits > b.visits) return -1;
  if (b.visits > a.visits) return 1;

  return 0;
}
library.add(fas)
export default class Create extends Component {
    state = {
      social_top: [],
      loaded_social: false,
      loaded_visits: false,
      loaded_visits_tenant: false,
      visits_top: [],
      visits_tenant: [],
    }
    componentDidMount() {
      axios.get('http://149.56.94.138:4000/dashboard/socialpopular')
        .then(res => {
          this.setState({
            loaded_social: true,
            social_top: res.data.likes_tenant.sort(compare_social)
          });
        });
      axios.get('http://149.56.94.138:4000/dashboard/popularvisits')
      .then(res => {
        this.setState({
          loaded_visits: true,
          visits_top: res.data.visits.sort(compare_visits)
        });
      });
      axios.get('http://149.56.94.138:4000/dashboard/tenantvisits')
      .then(res => {
        this.setState({
          loaded_visits_tenant: true,
          visits_tenant: res.data.tenants_visits.sort(compare_visits)
        });
      });
    }
    // function hellovendor(){
    //
    // }
    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Welcome to your dashboard</h3>
                <div className="container">
                <VenuesSales />
                <Card className="card-margin">
                  <Card.Header>
                  <Card.Title>Popular</Card.Title>
                  </Card.Header>
                  <Card.Body>
                      <div className="row">
                        <div className="col-md-12">
                        { this.state.loaded_social ? (
                        <Card className="card-margin">
                          <Card.Header className="dashboard-row">
                          Top 10 Popular pages
                          </Card.Header>
                          <Card.Body className="internal-card">
                            <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th>Id Tenant</th>
                                  <th className="text-center">Page</th>
                                  <th className="text-right">Likes</th>
                                </tr>
                              </thead>
                              <tbody>
                              {this.state.social_top.map((tlike, i) => {
                                  if(i > 10){
                                    return;
                                  }
                                 return (
                                   <tr>
                                     <td>{tlike.tenant_id}</td>
                                     <td>{tlike.page_name}</td>
                                     <td className="text-right">{numberFormat2.format(tlike.likes)}</td>
                                   </tr>
                                 )
                              })}
                              </tbody>
                              </Table>
                          </Card.Body>
                        </Card>
                          ) : (
                            <div className="text-center">
                              <FontAwesomeIcon icon="spinner" className="blue-spinner" spin  size="3x"/>
                            </div>
                          )
                        }
                        </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                          { this.state.loaded_visits_tenant ? (
                          <Card className="card-margin">
                            <Card.Header className="dashboard-row">
                            Top 10 Popular Vendor by Visits
                            </Card.Header>
                            <Card.Body className="internal-card">
                              <Table striped bordered hover size="sm">
                                <thead>
                                  <tr>
                                    <th>Id Tenant</th>
                                    <th>Brand</th>
                                    <th className="text-right">visits</th>
                                    <th className="text-right">Pass in front</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {this.state.visits_tenant.map((vtenant, i) => {
                                    if(i > 10){
                                      return;
                                    }
                                   return (
                                     <tr>
                                       <td>{vtenant.tenant_id}</td>
                                       <td>{vtenant.brand}</td>
                                       <td className="text-right">{numberFormat2.format(vtenant.visits)}</td>
                                       <td className="text-right">{numberFormat2.format(vtenant.pass)}</td>
                                     </tr>
                                   )
                                })}
                                </tbody>
                                </Table>
                            </Card.Body>
                          </Card>
                            ) : (
                              <div className="text-center">
                                <FontAwesomeIcon icon="spinner" className="blue-spinner" spin  size="3x"/>
                              </div>
                            )
                          }
                          </div>
                          </div>
                        <div className="row">
                          <div className="col-md-4">
                        { this.state.loaded_visits ? (
                          <Card className="card-margin">
                            <Card.Header className="dashboard-row">
                            Top venue visits (this year)
                            </Card.Header>
                            <Card.Body className="internal-card">
                            <Table striped bordered hover size="sm">
                              <thead>
                                <tr>
                                  <th>Id</th>
                                  <th className="text-center">Name</th>
                                  <th className="text-right">Visits</th>
                                </tr>
                              </thead>
                              <tbody>
                              {this.state.visits_top.map((visit, i) => {
                                  if(i > 10){
                                    return;
                                  }
                                 return (
                                   <tr>
                                     <td>{visit.venue_id}</td>
                                     <td>{visit.venue_name}</td>
                                     <td className="text-right">{numberFormat2.format(visit.visits)}</td>
                                   </tr>
                                 )
                              })}
                              </tbody>
                              </Table>
                            </Card.Body>
                          </Card>
                        ) : (
                          <div className="text-center">
                            <FontAwesomeIcon icon="spinner" className="blue-spinner" spin  size="3x"/>
                          </div>
                        )
                      }
                        </div>
                      </div>
                  </Card.Body>
                </Card>
                </div>

            </div>
        )
    }
}
