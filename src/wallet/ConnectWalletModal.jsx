import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import React, { useContext, useState } from "react";
import { PactContext } from "./pact-wallet";
import TextField from "@mui/material/TextField";
import { throttle } from "throttle-debounce";

export default function TransactionModal(props) {
  const {
    fetchAccountDetails,
    chainId,
    setConnectedWallet,
    closeConnectWallet,
    logoutAccount,
    account,
  } = useContext(PactContext);
  const [localAccount, setLocalAccount] = useState(account);
  const [fetchedAccountMessage, setFetchedAccountMessage] = useState(
    "Please enter an address to continue"
  );

  const onAccountNameChange = throttle(500, async (e) => {
    const accountName = e.target.value;
    setFetchedAccountMessage("Fetching acount details...");
    setLocalAccount(null);
    const tempAccount = await fetchAccountDetails(accountName);
    if (tempAccount == null) {
      setFetchedAccountMessage(`Account name not found on chain ${chainId}`);
    } else {
      setLocalAccount(tempAccount);
      setFetchedAccountMessage(
        "Please confirm if you want to use this account"
      );
    }
  });

  const onConnectAccount = () => {
    setConnectedWallet(localAccount);
  };

  const onClose = () => {
    setLocalAccount(null);
    setFetchedAccountMessage("Please enter an address to continue");
    closeConnectWallet();
  };

  if (props.open !== true) {
    return null;
  }
  return (
    <Modal
      open={props.open}
      onClose={() => {}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          style={paddingStyle}
          id="modal-modal-title"
          variant="h5"
          component="h2"
        >
          Enter your wallet address
        </Typography>
        <TextField
          style={{ ...paddingStyle, width: "100%" }}
          id="outlined-basic"
          label="Kadena Address"
          variant="outlined"
          defaultValue={localAccount?.account}
          onChange={onAccountNameChange}
        />
        <Typography
          style={paddingStyle}
          id="modal-modal-description"
          variant="h6"
          sx={{ mt: 2 }}
        >
          {fetchedAccountMessage}
        </Typography>
        <div style={{ paddingTop: 20 }}>
          <span style={{ paddingRight: 20 }}>
            <Button
              disabled={localAccount?.account == null}
              variant="contained"
              color="success"
              onClick={onConnectAccount}
              style={{ paddingRight: 20 }}
            >
              {account?.account == null ? "Confirm" : "Update"}
            </Button>
          </span>
          <span style={{ paddingRight: 20 }}>
            <Button variant="contained" onClick={onClose}>
              Cancel
            </Button>
          </span>
          {account?.account != null && (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                onClose();
                logoutAccount();
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
}

const paddingStyle = {
  paddingBottom: 20,
};

const style = {
  position: "absolute",
  borderRadius: 5,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
