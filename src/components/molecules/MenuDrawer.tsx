import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SelectGeneration } from "../atoms/SelectGeneration";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import { SelectChangeEvent } from "@mui/material/Select";
import { InputText } from "../atoms/InputText";
type Props = {
  drawerOpen: boolean;
  toggleDrawer: () => void;
};

export const MenuDrawer = memo((props: Props) => {
  const { drawerOpen, toggleDrawer } = props;
  const navigate = useNavigate();

  const [generation, setGeneration] = useState("");

  const onClickPokedex = () => {
    navigate("/pokedex");
  };

  const onClickSearchPoke = (condition?: string) => {
    const searchPoke = (condition?: string) => {
      navigate(`/pokedex/${condition}`);
    };

    toggleDrawer();
    searchPoke(condition);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const generationId = event.target.value as string;
    setGeneration(generationId);

    if (generationId != "0") {
      //世代指定の場合
      navigate(`/pokedex/generation/${generationId}`);
    } else {
      //allの場合
      navigate("/pokedex");
    }
  };
  const menuList = (
    <>
      <Box
        sx={{
          height: 200,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <p>What's this Pokemon's name?</p>
      </Box>
      <Divider />
      <Box sx={{ width: 250 }} role="presentation">
        <Divider />
        <List>
          <ListItem key="Pokedex" disablePadding>
            <ListItemButton
              onClick={() => {
                toggleDrawer();
                onClickPokedex();
              }}
            >
              <ListItemIcon>
                <Icon>list</Icon>
              </ListItemIcon>
              <ListItemText primary="Pokedex" />
            </ListItemButton>
          </ListItem>

          <List component="div" sx={{ pl: 4 }}>
            <ListItem key="seachcondi\tion">
              <InputText
                label="name or id"
                iconName="search"
                onClickEvent={onClickSearchPoke}
              />
            </ListItem>
            <ListItem key="generation">
              <SelectGeneration
                generation={generation}
                handleChange={(e) => {
                  toggleDrawer();
                  handleChange(e);
                }}
              />
            </ListItem>
          </List>

          <ListItem key="Games" disablePadding>
            <ListItemIcon>
              <Icon>sports_esports</Icon>
            </ListItemIcon>
            <ListItemText primary="Games" />
          </ListItem>

          <List component="div" disablePadding>
            <ListItemButton
              key="reading"
              sx={{ pl: 4 }}
              onClick={() => {
                toggleDrawer();
                navigate("/games/reading");
              }}
            >
              <ListItemIcon>
                <Icon>import_contacts</Icon>
              </ListItemIcon>
              <ListItemText primary="reading" />
            </ListItemButton>

            <ListItemButton
              key="spelling"
              sx={{ pl: 4 }}
              onClick={() => {
                toggleDrawer();
                navigate("/games/spelling");
              }}
            >
              <ListItemIcon>
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText primary="spelling" />
            </ListItemButton>
            <ListItemButton
              key="listening"
              sx={{ pl: 4 }}
              onClick={() => {
                toggleDrawer();
                navigate("/games/listening");
              }}
            >
              <ListItemIcon>
                <Icon>hearing</Icon>
              </ListItemIcon>
              <ListItemText primary="listening" />
            </ListItemButton>
            <ListItemButton
              key="score"
              onClick={() => {
                toggleDrawer();
                navigate("/score");
              }}
            >
              <ListItemIcon>
                <Icon>sports_score</Icon>
              </ListItemIcon>
              <ListItemText primary="Score" />
            </ListItemButton>
          </List>
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: "250px" }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          width: "250px",
        }}
      >
        {menuList}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: "250px",
        }}
        open
      >
        {menuList}
      </Drawer>
    </Box>
  );
});
