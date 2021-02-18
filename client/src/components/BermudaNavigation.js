import React from 'react';
import Link from '@material-ui/core/Link';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import VerticalAlignTopTwoToneIcon from '@material-ui/icons/VerticalAlignTopTwoTone';
import VerticalAlignBottomTwoToneIcon from '@material-ui/icons/VerticalAlignBottomTwoTone';

class BermudaNavigation extends React.Component {
  state = {
    value: "deposit",
  };


  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
      >
        <BottomNavigationAction label="Deposit" component={Link}
        href="/deposit" value="deposit" icon={<VerticalAlignBottomTwoToneIcon />} />
        <BottomNavigationAction label="Withdraw" href="/withdraw" value="withdraw" icon={<VerticalAlignTopTwoToneIcon />} />
      </BottomNavigation>
    );
  }
}

export default (BermudaNavigation);