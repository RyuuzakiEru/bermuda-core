import Web3 from 'Web3';

const getWeb3 = async () => {
    let web3 = new Web3();

    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function() {
          // User has allowed account access to DApp...
        });
      } catch (e) {
        // User has denied account access to DApp...
      }
    }
};

export default getWeb3;
