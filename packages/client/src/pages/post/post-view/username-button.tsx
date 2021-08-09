import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import ProfileDialog from "../../common/profile/profile-dialog";

const LinkButton = styled(Button)`
  text-transform: none;
  padding: 0;
  min-height: 0;
  min-width: 0;
  font-size: "1rem";
`;

interface UsernameButtonProps {
  username: string;
  userId: string;
}

const UsernameButton: React.FC<UsernameButtonProps> = ({
  username,
  userId,
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const handleViewAccount = () => {
    setProfileModalOpen(true);
  };

  const showProfileDialog = () => {
    if (profileModalOpen) {
      return (
        <ProfileDialog
          open={profileModalOpen}
          onClose={handleProfileModalClose}
          userId={userId}
        />
      );
    } else {
      return <span></span>;
    }
  };

  useEffect(() => {}, [profileModalOpen]);

  return (
    <span>
      <LinkButton variant="text" size="small" onClick={handleViewAccount}>
        <Typography variant="subtitle2">
          <b>{username ?? "anonymous"}</b>
        </Typography>
      </LinkButton>
      {showProfileDialog()}
    </span>
  );
};

export default UsernameButton;
