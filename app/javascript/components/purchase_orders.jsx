import React from 'react';
import PurchaseOrder from './purchase_order';
import Loader from './loader';
import Paginator from './paginator';

export default class PurchaseOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryResult: null
    };

    this.state.queryResult = new RecordsHelper(true).getBootstrapped();
  }

  render() {

    var gPage = parseInt(getUrlParameter('page'));
    if(gPage == null || isNaN(gPage)) gPage = 1;
    if(!this.state.queryResult || this.state.queryResult.info.page != gPage) {
      $.ajax({
        url: AppRoutes.purchaseOrders,
        data: { page: gPage},
        dataType: 'JSON',
        success: (data) => this.setState({queryResult: data})
      });    
    }
    
    const posTable = (!this.state.queryResult) ? <Loader/> : (
      <table className="table table-bordered record-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {this.state.queryResult.results.map(function(po) {
            return <PurchaseOrder key={po.id} purchase_order={po} row={true}/>;
          })}
        </tbody>
      </table>
    );
    
    return (
      <div>
        <h1>Purchase Orders</h1>
        {posTable}
        <Paginator {...(this.state.queryResult ? this.state.queryResult.info : {total: 1, per_page: 10, pages: 1, page: 1})} page={gPage} path={AppRoutes.purchaseOrders}/>
      </div>
    );
  }
}
