import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import OrdersList from '../components/ordersList';

const page = new ReactiveVar(1);
const changePage = (increment) => {
  if (increment) {
    page.set(page.get() + 1);
  } else {
    page.set(page.get() - 1);
  }
};

const searchValue = new ReactiveVar('');
const handleSearch = (value) => {
  searchValue.set(value);
};

const OrdersListContainer = withTracker(() => {
  let orders = Session.get('orders');
  Meteor.call('shopify.getOrders', page.get(), searchValue.get(), (err, res) => {
    Session.set('orders', res);
  });
  const loading = !orders;
  if (!loading) {
    const sortOrders = orders.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    orders = sortOrders;
  }
  const ordersExists = !loading && !!orders;
  return {
    orders,
    loading,
    ordersExists,
    changePage,
    handleSearch,
    page: page.get(),
  };
})(OrdersList);

export default OrdersListContainer;
