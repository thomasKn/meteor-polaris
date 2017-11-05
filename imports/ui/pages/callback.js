import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import {
  Layout,
  FooterHelp,
  Link,
  SettingToggle,
  Banner,
} from '@shopify/polaris';

export default class Callback extends Component {
  constructor() {
    super();
    this.state = {
      code: '',
      shop: '',
      loading: false,
      error: false,
    };
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');
    this.setState({
      code,
      shop,
    });
  }

  toggleConnection() {
    this.setState({
      loading: true,
    });
    Meteor.call('shopify.createShop', this.state.code, this.state.shop, (err) => {
      if (err) {
        console.log(err);
        this.setState({
          loading: false,
          error: true,
        });
      } else {
        this.props.history.push('/');
      }
    });
  }

  render() {
    return (
      <div>
        <Layout>
          <Layout.AnnotatedSection
            title="Style"
            description="Customize the style of your checkout"
          >
            {
              this.state.error ?
              <Banner
                title="Error connecting the store"
                status="critical"
              >
                <p>Go to your store, remove the App and do the process again please. <a target="_blank" href={`https://${this.state.shop}/admin/apps`}>Remove the App</a></p>
              </Banner> : <p></p>
            }
            <SettingToggle
              action={{
                content: 'Connect to Shopify Store',
                onAction: this.toggleConnection.bind(this),
                loading: this.state.loading,
              }}
            >
              Url code param: {this.state.code}
            </SettingToggle>
          </Layout.AnnotatedSection>
          <Layout.Section>
            <FooterHelp>For more details on Polaris, visit our <Link url="https://polaris.shopify.com">styleguide</Link>.</FooterHelp>
          </Layout.Section>
        </Layout>
      </div>
    );
  }
}

Callback.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
