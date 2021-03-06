import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { amountFormat, MomentFormats } from 'support/utils';
import moment from 'moment';
import LineItems from './line_items';
import { Redirect } from 'react-router-dom';
import Loader from './loader';
import { RecordsHelper } from 'support/recordsHelper';
import { AppRoutes } from 'support/appRoutes';

export default class PurchaseOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseOrder: this.props.row ? this.props.record : null
    };

    // No forward from parent, but bootstrap is available.
    if(!this.state.purchaseOrder && this.props.recordsHelper) {
      this.state.purchaseOrder = this.props.recordsHelper.consumeSingularBootstrap();
    }

    if(!this.state.purchaseOrder)
      $.ajax({
        url: AppRoutes.purchaseOrder(this.props.match.params.id),
        dataType: 'JSON',
        success: (data) => this.setState({purchaseOrder: data})
      });

    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick(e) {
    e.preventDefault();
    this.setState({redirect: true});
  }
  
  asRow() {
    if(!this.state.purchaseOrder) return (<Loader row={this.props.row} {...(this.props.row ? {colspan: 4} : {})}/>);

    if(this.state.redirect) return (<Redirect push to={AppRoutes.purchaseOrder(this.state.purchaseOrder.id)}/>);
    
    return (
      <tr key={this.state.purchaseOrder.id} onClick={this.handleRowClick}>
        <td>{this.state.purchaseOrder.title}</td>
        <td>{this.state.purchaseOrder.customer.first_name} {this.state.purchaseOrder.customer.last_name}</td>
        <td>{moment(this.state.purchaseOrder.date).format(MomentFormats.Time)}</td>
        <td>{amountFormat(this.state.purchaseOrder.total)}</td>
      </tr>
    );
  }

  asDetailed() {
    return (
      <div>
        <Helmet>
          <title>{this.state.purchaseOrder.title} Purchase Order</title>
        </Helmet>
        <h3>{this.state.purchaseOrder.title}</h3>
        Customer: <Link to={AppRoutes.customer(this.state.purchaseOrder.customer.id)}>
          ({this.state.purchaseOrder.customer.first_name} {this.state.purchaseOrder.customer.last_name})
        </Link>
        
        <LineItems data={this.state.purchaseOrder.line_items} purchase_order={this.state.purchaseOrder}/>;
      </div>
    );
  }
  
  render() {
    if(this.props.row) return this.asRow();

    return (!this.state.purchaseOrder ? (<Loader/>) : this.asDetailed());
  }
}
